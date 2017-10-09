import * as fs from 'fs';
import * as net from 'net';
import * as uuidv4 from 'uuid/v4';
import * as zmq from 'zmq';

import { createStore } from 'redux';
import networkApp from './reducers';

import { repOpen, reqOpen, reqConn, reqSent, reqRecv, repSent, repRecv, secretEst } from './actions';
import { genCert, genSignedMsg, verifySignedMsg, deriveSecret } from './cryptoFuncs';

const configFile = (process.argv.length > 2) ? process.argv[2] : 'config.json';

interface IConfig {
    name: string;
    privkey: string;
    peers: Array<{
        name: string;
        addr: string;
        port: number;
    }>;
    port: number;
}

const configStr = fs.readFileSync(configFile, 'utf8');
const config: IConfig = JSON.parse(configStr);

const store = createStore(networkApp);

store.subscribe(() => {
    console.log(store.getState());
});

const repSock = zmq.socket('rep');
repSock.bindSync('tcp://*:3000');

repSock.on('message', function(this: any, msg) {
    const sigMsg = JSON.parse(msg.toString());
    const certMsg = JSON.parse(sigMsg.data);
    if (verifySignedMsg(sigMsg, certMsg.pubkey)) {
        store.dispatch(reqRecv(certMsg));

        const challenge = certMsg.challenge;

        const serverTuple = genCert('3000', challenge, config.privkey, '127.0.0.1:3000');
        const serverCert = serverTuple[0];
        const serverTmpPrivKey = serverTuple[1];

        const serverSigMsg = genSignedMsg(JSON.stringify(serverCert), config.privkey);

        // cert.addr = '69.69.69.69:69';
        // clientSigMsg.data = JSON.stringify(cert);

        repSock.send(JSON.stringify(serverSigMsg));

        store.dispatch(repSent(serverCert, serverTmpPrivKey, '3009'));

        const serverSec = deriveSecret(serverTmpPrivKey, certMsg.tmpPubKey);

        store.dispatch(secretEst('3009', serverSec));
    }
});

store.dispatch(repOpen(repSock));

const reqSock = zmq.socket('req');
reqSock.on('message', (msg) => {
    const recvSigMsg = JSON.parse(msg.toString());
    const recvCertMsg = JSON.parse(recvSigMsg.data);
    if (verifySignedMsg(recvSigMsg, recvCertMsg.pubkey)) {
        store.dispatch(repRecv(recvCertMsg));

        const clientSec = deriveSecret(tmpPrivKey, recvCertMsg.tmpPubKey);
        store.dispatch(secretEst('3000', clientSec));
    }
});

store.dispatch(reqOpen(reqSock));

reqSock.connect('tcp://127.0.0.1:3000');
store.dispatch(reqConn('127.0.0.1:3000', '3000'));

const tuple = genCert('3009', uuidv4(), config.privkey, '127.0.0.1:3009');
const cert = tuple[0];
const tmpPrivKey = tuple[1];

const clientSigMsg = genSignedMsg(JSON.stringify(cert), config.privkey);

// cert.addr = '69.69.69.69:69';
// clientSigMsg.data = JSON.stringify(cert);

reqSock.send(JSON.stringify(clientSigMsg));

store.dispatch(reqSent(cert, tmpPrivKey, ['3000']));
