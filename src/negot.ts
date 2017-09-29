import * as elliptic from 'elliptic';

import { ConnectionStatus, derSign, derVerify, IPrivKey } from './util';

const EC = elliptic.ec;
const ec = new EC('secp256k1');

function clientNegotiate(data: Buffer, privKey: IPrivKey) {
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

        const signedChallenge = derSign(msgJson.challenge, privKey);

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
            sig: derSign(initMsgString, privKey),
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
}
