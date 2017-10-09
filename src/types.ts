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
