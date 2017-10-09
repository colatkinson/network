import * as elliptic from 'elliptic';
import * as crypto from 'crypto';

import { ICert, ISignedData } from './types';

const EC = elliptic.ec;
const ec = new EC('secp256k1');

export function derSign(data: string, privKeyStr: string): string {
    const hash = crypto.createHash('sha256');
    hash.update(data);
    const dataHash = hash.digest('hex');

    const privKey = ec.keyFromPrivate(privKeyStr);
    const sig = privKey.sign(dataHash);

    return sig.toDER('hex');
}

export function derVerify(data: string, pubKey: string, sig: string): boolean {
    const hash = crypto.createHash('sha256');
    hash.update(data);
    const initMsgHash = hash.digest('hex');

    const fKey = ec.keyFromPublic(pubKey, 'hex');

    const ver = fKey.verify(initMsgHash, sig);

    return ver;
}

export function genCert(name: string, challenge: string, privKeyStr: string, addr: string): [ICert, string] {
    const privKey = ec.keyFromPrivate(privKeyStr);

    const tmpKeyPair = ec.genKeyPair();
    const tmpPrivKey = tmpKeyPair.getPrivate('hex');

    const cert: ICert = {
        challenge,
        name,
        pubkey: privKey.getPublic().encode('hex'),
        timestamp: Date.now(),
        tmpPubKey: tmpKeyPair.getPublic().encode('hex'),
        version: '1.0.0',
        addr,
    };

    return [cert, tmpPrivKey];
}

export function genSignedMsg(data: string, privKeyStr: string): ISignedData {
    return {
        sig: derSign(data, privKeyStr),
        data,
    };
}

export function verifySignedMsg(msg: ISignedData, pubKeyStr: string): boolean {
    return derVerify(msg.data, pubKeyStr, msg.sig);
}

export function deriveSecret(privkeyStr: string, pubkeyStr: string): string {
    const pubkey = ec.keyFromPublic(pubkeyStr, 'hex');
    const privkey = ec.keyFromPrivate(privkeyStr, 'hex');

    const secret = privkey.derive(pubkey.getPublic());

    return secret.toString(16, 64);
}
