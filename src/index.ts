import * as fs from 'fs';
import * as net from 'net';
import * as uuidv4 from 'uuid/v4';
import * as zmq from 'zmq';

import { createStore } from 'redux';
import networkApp from './reducers';

import { repOpen, reqOpen, reqConn, reqSent } from './actions';
import { genCert, genSignedMsg, verifySignedMsg } from './cryptoFuncs';

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

// for (const peer of config.peers) {
// const recv = zmq.socket('pull');
// recv.connect('tcp://127.0.0.1:3000');
// console.log('connected');

// recv.on('message', function(this: any, msg) {
//     console.log(msg.toString());
//     console.log(this);
// });
// }

// const testCert =  {
//     challenge: 'asdf',
//     name: 'test',
//     pubkey: '1612',
//     recip: 'jundy',
//     timestamp: Date.now(),
//     tmpPubKey: 'c0ffee',
//     version: '1.0.0',
// };

// store.dispatch(genCert(testCert));

// const sock = zmq.socket('req');
// sock.bindSync('tcp://127.0.0.1:3000');
// sock.send('yo');
// sock.on('message', function(this: any, asdf) {
//     console.log(asdf);
//     this.send('hi');
// });

const repSock = zmq.socket('rep');
// repSock.connect('tcp://127.0.0.1:3000');
repSock.bindSync('tcp://*:3000');
console.log('connected');

repSock.on('message', function(this: any, msg) {
    console.log('server recvd: ' + msg.toString());
    // console.log(this);
    const sigMsg = JSON.parse(msg.toString());
    const certMsg = JSON.parse(sigMsg.data);
    console.log('Ver: ' + verifySignedMsg(sigMsg, certMsg.pubkey));
    this.send('ahoy');
});

store.dispatch(repOpen(repSock));

const reqSock = zmq.socket('req');
reqSock.on('message', (msg) => {
    console.log('client recvd: ' + msg.toString());
});

store.dispatch(reqOpen(reqSock));

reqSock.connect('tcp://127.0.0.1:3000');
store.dispatch(reqConn('127.0.0.1:3000', '3000'));

const tuple = genCert('3000', uuidv4(), config.privkey, '127.0.0.1:3000');
const cert = tuple[0];
const tmpPrivKey = tuple[1];

const clientSigMsg = genSignedMsg(JSON.stringify(cert), config.privkey);

// cert.addr = '69.69.69.69:69';
// clientSigMsg.data = JSON.stringify(cert);

reqSock.send(JSON.stringify(clientSigMsg));

store.dispatch(reqSent(cert, tmpPrivKey, ['3000']));
