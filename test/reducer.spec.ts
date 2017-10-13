/* tslint:disable:no-unused-expression */

import { expect } from 'chai';
import 'mocha';

import * as zmq from 'zmq';

import networkApp from '../src/reducers';
import { repOpen } from '../src/actions';
import * as rt from '../src/reduxTypes';

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
});
