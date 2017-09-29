import * as crypto from 'crypto';

enum ConnectionStatus {
    None,
    ServerInfoSent,
    ClientInfoSent,
    Connected,
}

interface ISig {
    toDER(format: string): string;
}

interface IPubKey {
    encode(format: string): string;
}

interface IPrivKey {
    sign(hash: string): ISig;
    getPublic(): IPubKey;
}

function derSign(data: string, privKey: IPrivKey): string {
    const hash = crypto.createHash('sha256');
    hash.update(data);
    const dataHash = hash.digest('hex');
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

export { ConnectionStatus, derSign, derVerify, IPrivKey };
