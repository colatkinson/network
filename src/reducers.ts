import { combineReducers } from 'redux';
import {
    GEN_CERT,
    ICert,
    IN_OPEN,
    ISocket,
    OUT_OPEN,
    SECRET_EST,
} from './actions';

interface IState {
    readonly outConns: {
        [name: string]: ISocket;
    };
    readonly inConns: {
        [name: string]: ISocket;
    };
    readonly secrets: {
        [name: string]: string;
    };
    readonly outCerts: {
        [name: string]: ICert;
    };
    readonly inCerts: {
        [name: string]: ICert;
    };
}

const initialState: IState = {
    inCerts: {},
    inConns: {},
    outCerts: {},
    outConns: {},
    secrets: {},
};

interface IAction {
    type: string;
    socket?: ISocket;
    cert?: ICert;
    name?: string;
    secret?: string;
}

function networkApp(state = initialState, action: IAction) {
    switch (action.type) {
        case OUT_OPEN: {
            if (typeof action.socket === 'undefined') {
                throw new Error('Socket undefined in OUT_OPEN');
            }

            const newState = { ...state };
            const newOutConns = { ...state.outConns };
            newOutConns[action.socket.name] = action.socket;

            newState.outConns = newOutConns;

            return newState;
        }
        case GEN_CERT: {
            if (typeof action.cert === 'undefined') {
                throw new Error('Cert undefined in GEN_CERT');
            }

            const newState = { ...state };
            const newOutCerts = { ...state.outCerts };
            newOutCerts[action.cert.recip] = action.cert;

            newState.outCerts = newOutCerts;

            return newState;
        }
        case IN_OPEN: {
            if (typeof action.socket === 'undefined') {
                throw new Error('Socket undefined in IN_OPEN');
            }

            if (typeof action.cert === 'undefined') {
                throw new Error('Cert undefined in IN_OPEN');
            }

            const newState = { ...state };

            const newOutConns = { ...state.outConns };
            newOutConns[action.socket.name] = action.socket;

            newState.outConns = newOutConns;

            const newInCerts = { ...state.inCerts };
            newInCerts[action.socket.name] = action.cert;

            newState.inCerts = newInCerts;

            return newState;
        }
        case SECRET_EST: {
            if (typeof action.secret === 'undefined') {
                throw new Error('Secret undefined in SECRET_EST');
            }

            if (typeof action.name === 'undefined') {
                throw new Error('Name undefined in SECRET_EST');
            }

            const newState = { ...state };

            const newSecrets = { ...state.secrets };
            newSecrets[action.name] = action.secret;

            newState.secrets = newSecrets;

            return newState;
        }
        default:
            return state;
    }
}

export default networkApp;
