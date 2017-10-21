/* tslint:disable:no-unused-expression */

import { expect } from 'chai';
import 'mocha';

import * as zmq from 'zmq';

import { ICert, IConfig } from '../src/types';

import { loadConfig, repOpen, reqOpen, reqConn, reqSent, reqRecv, repSent, repRecv, secretEst } from '../src/actions';
import * as rt from '../src/reduxTypes';

const pubkey = '046ea7c4b3cb54ee855c958da1a2f95d7e7898045367da27b012184f288ca8ad2' +
               '279263df3a3ec7987e754b9adff37290941b31380869271d21ac999d2ef54fef9';

const privkey2 = '04c6b604f75ea695aebac2deb48eaa1223470e239cb0120dad57d72f34d69eff8' +
                 'd53cb7cfed328d909a10a65e6e291f42547429dce04840f2dfcb847699d4ce385';
const pubkey2 = '0464d73ea8d86d22fbe466d9c14c1343f4f6e398f91879b699c2ed4aaf53391e7' +
                '93b402a50f3fb0aea910a21ddafd218429d97b271539f6c42a614c4a201c571a2';

const cert: ICert = {
    challenge: 'challenging!',
    name: 'hera',
    pubkey,
    timestamp: 3005,
    tmpPubKey: pubkey2,
    version: '1.0.0',
    addr: '127.0.0.1:8000',
};

const config: IConfig = {
    name: 'Test2',
    privkey: privkey2,
    peers: [
        {
            name: 'Test',
            addr: '127.0.0.1',
            port: 5000,
        },
    ],
    port: 5001,
};

describe('Redux Actions', () => {
    it('should create an action for loading config', () => {
        const act = loadConfig(config);

        const expected = {
            type: rt.LOAD_CONFIG,
            config,
        };

        expect(act).to.deep.equal(expected);
    });

    it('should create an action for a rep sock opening', () => {
        const socket = zmq.createSocket('rep');
        const act = repOpen(socket);

        const expected = {
            type: rt.REP_OPEN,
            socket,
        };

        socket.close();

        expect(act).to.deep.equal(expected);
    });

    it('should create an action for a req sock opening', () => {
        const socket = zmq.createSocket('req');
        const act = reqOpen(socket);

        const expected = {
            type: rt.REQ_OPEN,
            socket,
        };

        socket.close();

        expect(act).to.deep.equal(expected);
    });

    it('should create an action for registering a request connection', () => {
        const act = reqConn('127.0.0.1:8000', 'zeus');

        const expected = {
            type: rt.REQ_CONN,
            addr: '127.0.0.1:8000',
            name: 'zeus',
        };
    });

    it('should create an action for registering a request connection', () => {
        const act = reqConn('127.0.0.1:8000', 'zeus');

        const expected = {
            type: rt.REQ_CONN,
            addr: '127.0.0.1:8000',
            name: 'zeus',
        };
    });

    it('should create an action for an outgoing request', () => {
        const act = reqSent(cert, privkey2, ['zeus']);

        const expected = {
            type: rt.REQ_SENT,
            cert,
            names: ['zeus'],
            tmpPrivKey: privkey2,
        };

        expect(act).to.deep.equal(expected);
    });

    it('should create an action for receiving a request', () => {
        const act = reqRecv(cert);

        const expected = {
            type: rt.REQ_RECV,
            cert,
        };

        expect(act).to.deep.equal(expected);
    });

    it('should create an action for sending a reply', () => {
        const act = repSent(cert, privkey2, 'zeus');

        const expected = {
            type: rt.REP_SENT,
            cert,
            tmpPrivKey: privkey2,
            name: 'zeus',
        };

        expect(act).to.deep.equal(expected);
    });

    it('should create an action for receiving a reply', () => {
        const act = repRecv(cert);

        const expected = {
            type: rt.REP_RECV,
            cert,
        };

        expect(act).to.deep.equal(expected);
    });

    it('should create an action for establishing a secret', () => {
        const act = secretEst('zeus', '0123456789abcdef');

        const expected = {
            type: rt.SECRET_EST,
            name: 'zeus',
            secret: '0123456789abcdef',
        };

        expect(act).to.deep.equal(expected);
    });
});
