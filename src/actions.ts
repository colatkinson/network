import * as zmq from 'zmq';
import { ICert, ISocket } from './types';

// export const OUT_OPEN = 'OUT_OPEN';
// export const IN_OPEN = 'IN_OPEN';
// export const GEN_CERT = 'GEN_CERT';
// export const SECRET_EST = 'SECRET_EST';

export const REP_OPEN = 'REP_OPEN';
export const REQ_OPEN = 'REQ_OPEN';
export const REQ_CONN = 'REQ_CONN';
// export const GEN_CERT = 'GEN_CERT';
export const REQ_SENT = 'REQ_SENT';
export const REQ_RECV = 'REQ_RECV';
export const REP_SENT = 'REP_SENT';
export const REP_RECV = 'REP_RECV';
export const SECRET_EST = 'SECRET_EST';

// export interface ICert {
//     challenge: string;
//     name: string;
//     pubkey: string;
//     // recip: string;
//     timestamp: number;
//     tmpPubKey: string;
//     version: string;
//     // ip: string;
//     // port: number;
//     addr: string;
// }

// export interface ISocket extends zmq.Socket {
//     // name: string;
// }

export function repOpen(socket: ISocket) {
    return {
        socket,
        type: REP_OPEN,
    };
}

export function reqOpen(socket: ISocket) {
    return {
        socket,
        type: REQ_OPEN,
    };
}

export function reqConn(addr: string, name: string) {
    return {
        addr,
        name,
        type: REQ_CONN,
    };
}

export function reqSent(cert: ICert, tmpPrivKey: string, names: string[]) {
    return {
        cert,
        names,
        tmpPrivKey,
        type: REQ_SENT,
    };
}

export function reqRecv(cert: ICert) {
    return {
        cert,
        type: REQ_RECV,
    };
}

export function repSent(cert: ICert, name: string) {
    return {
        cert,
        name,
        type: REP_SENT,
    };
}

export function repRecv(cert: ICert) {
    return {
        cert,
        type: REP_RECV,
    };
}

export function secretEst(name: string, secret: string) {
    return {
        name,
        secret,
        type: SECRET_EST,
    };
}

// export function outOpen(socket: ISocket) {
//     return {
//         socket,
//         type: OUT_OPEN,
//     };
// }

// export function inOpen(socket: ISocket, cert: ICert) {
//     return {
//         cert,
//         socket,
//         type: IN_OPEN,
//     };
// }

// export function genCert(cert: ICert) {
//     return {
//         cert,
//         type: GEN_CERT,
//     };
// }

// export function secretEst(name: string, secret: string) {
//     return {
//         name,
//         secret,
//         type: SECRET_EST,
//     };
// }
