import * as fs from 'fs';
import * as net from 'net';
import * as uuidv4 from 'uuid/v4';
import * as zmq from 'zmq';
import * as ip from 'ip';

import { createStore } from 'redux';
import networkApp from './reducers';

import { loadConfig, repOpen, reqOpen, reqConn, reqSent, reqRecv, repSent, repRecv, secretEst } from './actions';
import { genCert, genSignedMsg, verifySignedMsg, deriveSecret } from './cryptoFuncs';

import { IConfig, ICert } from './types';

const ipAddr = ip.address();

const store = createStore(networkApp);

store.subscribe(() => {
    console.log(store.getState());
});

const configFile = (process.argv.length > 2) ? process.argv[2] : 'config.json';

const configStr = fs.readFileSync(configFile, 'utf8');
const config: IConfig = JSON.parse(configStr);
store.dispatch(loadConfig(config));

const repSock = zmq.socket('rep');
repSock.bindSync(`tcp://*:${config.port}`);

repSock.on('message', function(this: any, msg) {
    const sigMsg = JSON.parse(msg.toString());
    const certMsg: ICert = JSON.parse(sigMsg.data);
    if (verifySignedMsg(sigMsg, certMsg.pubkey)) {
        store.dispatch(reqRecv(certMsg));

        const challenge = certMsg.challenge;

        const serverTuple = genCert(config.name, challenge, config.privkey, `${ipAddr}:${config.port}`);
        const serverCert = serverTuple[0];
        const serverTmpPrivKey = serverTuple[1];

        const serverSigMsg = genSignedMsg(JSON.stringify(serverCert), config.privkey);

        repSock.send(JSON.stringify(serverSigMsg));

        store.dispatch(repSent(serverCert, serverTmpPrivKey, certMsg.name));

        const serverSec = deriveSecret(serverTmpPrivKey, certMsg.tmpPubKey);

        store.dispatch(secretEst(certMsg.name, serverSec));
    } else {
        console.error(`Could not verify message from ${certMsg.name}`);
    }
});

store.dispatch(repOpen(repSock));

for (const peer of config.peers) {
    const reqSock = zmq.socket('req');
    reqSock.on('message', (msg) => {
        const recvSigMsg = JSON.parse(msg.toString());
        const recvCertMsg = JSON.parse(recvSigMsg.data);
        if (verifySignedMsg(recvSigMsg, recvCertMsg.pubkey)) {
            store.dispatch(repRecv(recvCertMsg));

            const clientSec = deriveSecret(tmpPrivKey, recvCertMsg.tmpPubKey);
            store.dispatch(secretEst(peer.name, clientSec));
        } else {
            console.error(`Could not verify message from ${recvCertMsg.name}`);
        }
    });

    store.dispatch(reqOpen(reqSock));

    reqSock.connect(`tcp://${peer.addr}:${peer.port}`);
    store.dispatch(reqConn(`tcp://${peer.addr}:${peer.port}`, peer.name));

    const tuple = genCert(config.name, uuidv4(), config.privkey, `${ipAddr}:${config.port}`);
    const cert = tuple[0];
    const tmpPrivKey = tuple[1];

    const clientSigMsg = genSignedMsg(JSON.stringify(cert), config.privkey);

    reqSock.send(JSON.stringify(clientSigMsg));

    store.dispatch(reqSent(cert, tmpPrivKey, [peer.name]));
}
