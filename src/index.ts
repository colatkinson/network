import * as net from 'net';
import * as uuidv4 from 'uuid/v4';
import * as zmq from 'zmq';

import { createStore } from 'redux';
import networkApp from './reducers';

import { genCert } from './actions';

const store = createStore(networkApp);

store.subscribe(() => {
    console.log(store.getState());
});

const testCert =  {
    challenge: 'asdf',
    name: 'test',
    pubkey: '1612',
    recip: 'jundy',
    timestamp: Date.now(),
    tmpPubKey: 'c0ffee',
    version: '1.0.0',
};

store.dispatch(genCert(testCert));
