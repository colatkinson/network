import * as zmq from 'zmq';

export interface ICert {
    challenge: string;
    name: string;
    pubkey: string;
    // recip: string;
    timestamp: number;
    tmpPubKey: string;
    version: string;
    // ip: string;
    // port: number;
    addr: string;
}

export interface ISocket extends zmq.Socket {
    // name: string;
}

export interface ISignedData {
    sig: string;
    data: string;
}

export interface IState {
    readonly repSock: ISocket | null;
    readonly reqSock: ISocket | null;
    readonly secrets: {
        [name: string]: string;
    };
    readonly foreignCerts: {
        [name: string]: ICert;
    };
    readonly nativeCerts: {
        [name: string]: ICert;
    };
    // readonly reqConns: Remote[];
    readonly ipsToNames: {
        [name: string]: string;
    };
    readonly namesToIps: {
        [addr: string]: string;
    };
    readonly tmpPrivKeys: {
        [name: string]: string;
    };
}

export interface IAction {
    type: string | null;
    socket?: ISocket;
    cert?: ICert;
    name?: string;
    secret?: string;
    addr?: string;
    names?: string[];
    tmpPrivKey?: string;
}
