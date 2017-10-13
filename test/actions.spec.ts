/* tslint:disable:no-unused-expression */

import { expect } from 'chai';
import 'mocha';

import * as zmq from 'zmq';

import { repOpen, reqOpen } from '../src/actions';
import * as rt from '../src/reduxTypes';

describe('Redux Actions', () => {
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
});
