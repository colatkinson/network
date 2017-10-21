import { ICert, ISocket, IAction, IConfig } from './types';
import {
    LOAD_CONFIG,
    REP_OPEN,
    REQ_OPEN,
    REQ_CONN,
    REQ_SENT,
    REQ_RECV,
    REP_SENT,
    REP_RECV,
    SECRET_EST,
} from './reduxTypes';

export function loadConfig(config: IConfig): IAction {
    return {
        type: LOAD_CONFIG,
    };
}

export function repOpen(socket: ISocket): IAction {
    return {
        socket,
        type: REP_OPEN,
    };
}

export function reqOpen(socket: ISocket): IAction {
    return {
        socket,
        type: REQ_OPEN,
    };
}

export function reqConn(addr: string, name: string): IAction {
    return {
        addr,
        name,
        type: REQ_CONN,
    };
}

export function reqSent(cert: ICert, tmpPrivKey: string, names: string[]): IAction {
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

export function repRecv(cert: ICert): IAction {
    return {
        cert,
        type: REP_RECV,
    };
}

export function secretEst(name: string, secret: string): IAction {
    return {
        name,
        secret,
        type: SECRET_EST,
    };
}
