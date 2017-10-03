import * as net from 'net';

export const CLIENT_SOCK_OPEN = 'CLIENT_SOCK_OPEN';
export const SERVER_SOCK_OPEN = 'SERVER_SOCK_OPEN';
export const CLIENT_RECV_CERT = 'CLIENT_RECV_CERT';
export const SERVER_SEND_CERT = 'SERVER_SEND_CERT';
export const CLIENT_SEND_RESP = 'CLIENT_SEND_RESP';
export const SECRET_EST = 'SECRET_EST';

export interface ICert {
    challenge: string;
    name: string;
    pubkey: string;
    timestamp: number;
    tmpPubKey: string;
    version: string;
}

export class ExtSock extends net.Socket {
    public uuid: string;
}

export function clientOpenSock(socket: ExtSock) {
    return {
        socket,
        type: CLIENT_SOCK_OPEN,
    };
}

export function serverOpenSock(socket: ExtSock) {
    return {
        socket,
        type: SERVER_SOCK_OPEN,
    };
}

export function clientRecvCert(cert: ICert) {
    return {
        cert,
        type: CLIENT_RECV_CERT,
    };
}

export function serverSendCert(cert: ICert) {
    return {
        cert,
        type: SERVER_SEND_CERT,
    };
}

export function clientSendResp(cert: ICert) {
    return {
        cert,
        type: CLIENT_SEND_RESP,
    };
}

export function secretEst(secret: string) {
    return {
        secret,
        type: SECRET_EST,
    };
}
