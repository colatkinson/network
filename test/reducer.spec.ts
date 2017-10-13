/* tslint:disable:no-unused-expression */

import { expect } from 'chai';
import 'mocha';

import * as zmq from 'zmq';

import { ICert } from '../src/types';

import networkApp from '../src/reducers';
import { repOpen, reqOpen, reqConn, reqSent } from '../src/actions';
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

describe('Redux Reducer', () => {
    it('should return the initial state', () => {
        const state = networkApp(undefined, { type: null });

        const expected = {
            repSock: null,
            reqSock: null,
            secrets: {},
            foreignCerts: {},
            nativeCerts: {},
            ipsToNames: {},
            namesToIps: {},
            tmpPrivKeys: {},
        };

        expect(state).to.deep.equal(expected);
    });

    it('should return the given state', () => {
        const expected = {
            repSock: null,
            reqSock: null,
            secrets: {},
            foreignCerts: {},
            nativeCerts: {},
            ipsToNames: {},
            namesToIps: {},
            tmpPrivKeys: {},
        };

        const state = networkApp(expected, { type: null });

        expect(state).to.deep.equal(expected);
    });

    it('should handle REP_OPEN', () => {
        const socket = zmq.createSocket('rep');

        const state = networkApp(undefined, repOpen(socket));

        socket.close();

        const expected = {
            repSock: socket,
            reqSock: null,
            secrets: {},
            foreignCerts: {},
            nativeCerts: {},
            ipsToNames: {},
            namesToIps: {},
            tmpPrivKeys: {},
        };

        expect(state).to.deep.equal(expected);
    });

    it('should throw on undefined socket in REP_OPEN', () => {
        const bound = networkApp.bind(networkApp, undefined, { type: rt.REP_OPEN, socket: undefined });

        expect(bound).to.throw(Error, 'Socket undefined in REP_OPEN');
    });

    it('should handle REQ_OPEN', () => {
        const socket = zmq.createSocket('req');

        const state = networkApp(undefined, reqOpen(socket));

        socket.close();

        const expected = {
            repSock: null,
            reqSock: socket,
            secrets: {},
            foreignCerts: {},
            nativeCerts: {},
            ipsToNames: {},
            namesToIps: {},
            tmpPrivKeys: {},
        };

        expect(state).to.deep.equal(expected);
    });

    it('should throw on undefined socket in REQ_OPEN', () => {
        const bound = networkApp.bind(networkApp, undefined, { type: rt.REQ_OPEN });

        expect(bound).to.throw(Error, 'Socket undefined in REQ_OPEN');
    });

    it('should handle REQ_CONN', () => {
        const state = networkApp(undefined, reqConn('127.0.0.1:8000', 'zeus'));

        const expected = {
            repSock: null,
            reqSock: null,
            secrets: {},
            foreignCerts: {},
            nativeCerts: {},
            ipsToNames: {
                '127.0.0.1:8000': 'zeus',
            },
            namesToIps: {
                zeus: '127.0.0.1:8000',
            },
            tmpPrivKeys: {},
        };

        expect(state).to.deep.equal(expected);
    });

    it('should throw on undefined addr or name in REQ_CONN', () => {
        const bound = networkApp.bind(networkApp, undefined, { type: rt.REQ_CONN });

        expect(bound).to.throw(Error, 'Addr or name undefined in REQ_CONN');
    });

    it('should handle REQ_SENT', () => {
        const state = networkApp(undefined, reqSent(cert, privkey2, ['zeus']));

        const expected = {
            repSock: null,
            reqSock: null,
            secrets: {},
            foreignCerts: {},
            nativeCerts: {
                zeus: cert,
            },
            ipsToNames: {},
            namesToIps: {},
            tmpPrivKeys: {
                zeus: privkey2,
            },
        };

        expect(state).to.deep.equal(expected);
    });

    it('should throw on undefined cert, privkey, or names in REQ_SENT', () => {
        const bound = networkApp.bind(networkApp, undefined, { type: rt.REQ_SENT });

        expect(bound).to.throw(Error, 'Cert or names or priv key undefined in REQ_SENT');
    });
});
