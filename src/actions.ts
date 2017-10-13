import * as zmq from 'zmq';
import { ICert, ISocket } from './types';
import {
    REP_OPEN,
    REQ_OPEN,
    REQ_CONN,
    REQ_SENT,
    REQ_RECV,
    REP_SENT,
    REP_RECV,
    SECRET_EST,
} from './reduxTypes';

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

export function repSent(cert: ICert, tmpPrivKey: string, name: string) {
    return {
        cert,
        name,
        tmpPrivKey,
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
