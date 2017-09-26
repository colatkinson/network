import * as crypto from 'crypto';
import * as elliptic from 'elliptic';
import * as fs from 'fs';
import * as net from 'net';
import * as uuidv4 from 'uuid/v4';

// const hash = crypto.createHash('sha256');

const EC = elliptic.ec;
const ec = new EC('secp256k1');

// const privKeyString = fs.readFileSync('privkey', 'utf8').trim();
// const name = fs.readFileSync('name', 'utf8').trim();

console.log(process.argv);
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

const name = config.name;
const port = config.port;

const privKey = ec.keyFromPrivate(config.privkey);
console.log('Loaded private key');

enum ConnectionStatus {
    None,
    ServerInfoSent,
    ClientInfoSent,
    Connected,
}

// interface INode {
//     socket: net.Socket;
//     status: ConnectionStatus;
//     uuid: string;
// }

class Conn extends net.Socket {
    public status: ConnectionStatus;
    public uuid: string;
    public pubkey: string;
    public name: string;
    public tmpFPubkey: string;
    public tmpPrivkey: string;
}

const connections: Conn[] = [];

const servers: Node[] = [];

console.log(privKey.constructor.name);

function derSign(data: string): string {
    const hash = crypto.createHash('sha256');
    hash.update(data);
    const dataHash = hash.digest('hex');
    // TODO: Fix that this uses an ugly global
    const sig = privKey.sign(dataHash);

    return sig.toDER('hex');
}

function derVerify(data: string, pubkey: string, sig: string): boolean {
    const hash = crypto.createHash('sha256');
    hash.update(data);
    const initMsgHash = hash.digest('hex');

    const fKey = ec.keyFromPublic(pubkey, 'hex');

    const ver = fKey.verify(initMsgHash, sig);

    return ver;
}

for (const peer of config.peers) {
    const socket = new Conn();
    socket.status = ConnectionStatus.None;

    socket.connect(peer.port, peer.addr, () => {
        console.log(`Connected to ${peer.name}`);
    });

    socket.on('data', (data) => {
        console.log('<' + data.toString('utf8'));

        const dataJson = JSON.parse(data.toString('utf8'));

        const msgJson = JSON.parse(dataJson.data);

        const ver = derVerify(dataJson.data, msgJson.pubkey, dataJson.sig);

        if (!ver) {
            socket.end();
            return;
        }

        if (socket.status === ConnectionStatus.None) {
            socket.status = ConnectionStatus.ServerInfoSent;

            const signedChallenge = derSign(msgJson.challenge);

            const tmpKeyPair = ec.genKeyPair();
            socket.tmpPrivkey = tmpKeyPair.getPrivate('hex');

            const initMsgData = {
                challengeSig: signedChallenge,
                name,
                pubkey: privKey.getPublic().encode('hex'),
                timestamp: Date.now(),
                tmpPubkey: tmpKeyPair.getPublic().encode('hex'),
                version: '1.0.0',
            };
            const initMsgString = JSON.stringify(initMsgData);

            const signedInitMsg = {
                data: initMsgString,
                sig: derSign(initMsgString),
            };

            socket.write(JSON.stringify(signedInitMsg));

            socket.status = ConnectionStatus.ClientInfoSent;

            socket.tmpFPubkey = msgJson.tmpPubkey;

            const tmpFPubkey = ec.keyFromPublic(socket.tmpFPubkey, 'hex');
            const tmpPrivkey = ec.keyFromPrivate(socket.tmpPrivkey, 'hex');

            const secret = tmpPrivkey.derive(tmpFPubkey.getPublic());

            console.log(secret.toString(16, 64));

            socket.status = ConnectionStatus.Connected;
        }
    });

    socket.on('close', () => {
        console.log('Closed');
    });
}

const clients: Conn[] = [];

net.createServer((socket) => {
    // const curClient = {
    //     socket,
    //     status: ConnectionStatus.None,
    //     uuid: uuidv4(),
    // };
    const castSock = socket as Conn;

    clients.push(castSock);

    castSock.status = ConnectionStatus.ServerInfoSent;

    // console.log(socket.address());

    // socket.write("Welcome, friend! You are " + curClient.uuid + '\n');

    const tmpKeyPair = ec.genKeyPair();
    castSock.tmpPrivkey = tmpKeyPair.getPrivate('hex');

    const initMsgData = {
        challenge: uuidv4(),
        name,
        pubkey: privKey.getPublic().encode('hex'),
        timestamp: Date.now(),
        tmpPubkey: tmpKeyPair.getPublic().encode('hex'),
        version: '1.0.0',
    };
    const initMsgString = JSON.stringify(initMsgData);

    const signedInitMsg = {
        data: initMsgString,
        sig: derSign(initMsgString),
    };

    castSock.write(JSON.stringify(signedInitMsg));
    castSock.status = ConnectionStatus.ServerInfoSent;

    castSock.on('data', function(this: Conn, data: Buffer) {
        console.log('<' + data.toString('utf8'));

        if (castSock.status === ConnectionStatus.ServerInfoSent) {
            const dataJson = JSON.parse(data.toString('utf8'));

            const msgJson = JSON.parse(dataJson.data);

            const ver = derVerify(dataJson.data, msgJson.pubkey, dataJson.sig);

            if (!ver) {
                castSock.end();
                return;
            }

            castSock.status = ConnectionStatus.ClientInfoSent;

            castSock.tmpFPubkey = msgJson.tmpPubkey;

            const tmpFPubkey = ec.keyFromPublic(castSock.tmpFPubkey, 'hex');
            const tmpPrivkey = ec.keyFromPrivate(castSock.tmpPrivkey, 'hex');

            const secret = tmpPrivkey.derive(tmpFPubkey.getPublic());

            console.log(secret.toString(16, 64));

            castSock.status = ConnectionStatus.Connected;
        }
    });

    socket.on('end', () => {
        let index = -1;
        for (let i = 0; i < clients.length; ++i) {
            if (clients[i] === castSock) {
                index = i;
                break;
            }
        }

        if (index >= 0) {
            console.log('Disconnect client ' + clients[index].name);
            clients.splice(index, 1);
        }
    });
}).listen(port);
