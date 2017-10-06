import * as zmq from 'zmq';

export const OUT_OPEN = 'OUT_OPEN';
export const IN_OPEN = 'IN_OPEN';
export const GEN_CERT = 'GEN_CERT';
export const SECRET_EST = 'SECRET_EST';

export interface ICert {
    challenge: string;
    name: string;
    pubkey: string;
    recip: string;
    timestamp: number;
    tmpPubKey: string;
    version: string;
}

export interface ISocket extends zmq.Socket {
    name: string;
}

export function outOpen(socket: ISocket) {
    return {
        socket,
        type: OUT_OPEN,
    };
}

export function inOpen(socket: ISocket, cert: ICert) {
    return {
        cert,
        socket,
        type: IN_OPEN,
    };
}

export function genCert(cert: ICert) {
    return {
        cert,
        type: GEN_CERT,
    };
}

export function secretEst(name: string, secret: string) {
    return {
        name,
        secret,
        type: SECRET_EST,
    };
}
