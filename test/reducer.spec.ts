/* tslint:disable:no-unused-expression */

import { expect } from 'chai';
import 'mocha';

import networkApp from '../src/reducers';

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
});
