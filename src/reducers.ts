import { combineReducers } from 'redux';
import {
    REP_OPEN,
    REQ_OPEN,
    REQ_CONN,
    REQ_SENT,
    REQ_RECV,
    REP_SENT,
    REP_RECV,
    SECRET_EST,
} from './reduxTypes';
import { ICert, ISocket, IState, IAction } from './types';

// class Remote {
//     public ip: string;
//     public port: number;

//     // constructor(ip: string, port: number) {
//     //     this.ip = ip;
//     //     this.port = port;
//     // }
//     public toString() {
//         return JSON.stringify(this);
//     }
// }

const initialState: IState = {
    repSock: null,
    reqSock: null,
    secrets: {},
    foreignCerts: {},
    nativeCerts: {},
    ipsToNames: {},
    namesToIps: {},
    tmpPrivKeys: {},
};

function networkApp(state = initialState, action: IAction) {
    switch (action.type) {
        case REP_OPEN: {
            if (typeof action.socket === 'undefined') {
                throw new Error('Socket undefined in REP_OPEN');
            }

            const newState = {
                ...state,
                repSock: action.socket,
            };

            return newState;
        }
        case REQ_OPEN: {
            if (typeof action.socket === 'undefined') {
                throw new Error('Socket undefined in REQ_OPEN');
            }

            const newState = {
                ...state,
                reqSock: action.socket,
            };

            return newState;
        }
        case REQ_CONN: {
            if (typeof action.addr === 'undefined' || typeof action.name === 'undefined') {
                throw new Error('Addr or name undefined in REQ_CONN');
            }

            const newIpsToNames = { ...state.ipsToNames };
            newIpsToNames[action.addr] = action.name;

            const newNamesToIps = { ...state.namesToIps };
            newNamesToIps[action.name] = action.addr;

            // const newReqConns = state.reqConns.slice();
            // newReqConns.push({
            //     ip: action.ip,
            //     port: action.port,
            // });

            const newState = {
                ...state,
                ipsToNames: newIpsToNames,
                namesToIps: newNamesToIps,
            };

            return newState;
        }
        case REQ_SENT: {
            if (typeof action.cert === 'undefined' ||
                typeof action.names === 'undefined' ||
                typeof action.tmpPrivKey === 'undefined') {
                throw new Error('Cert or names or priv key undefined in REQ_SENT');
            }

            const newNativeCerts = { ...state.nativeCerts };
            const newTmpPrivKeys = { ...state.tmpPrivKeys };

            for (const name of action.names) {
                newNativeCerts[name] = action.cert;
                newTmpPrivKeys[name] = action.tmpPrivKey;
            }

            const newState = {
                ...state,
                nativeCerts: newNativeCerts,
                tmpPrivKeys: newTmpPrivKeys,
            };

            return newState;
        }
        case REQ_RECV: {
            if (typeof action.cert === 'undefined') {
                throw new Error('Cert undefined in REQ_RECV');
            }

            const newForeignCerts = { ...state.foreignCerts };
            newForeignCerts[action.cert.name] = action.cert;

            const newIpsToNames = { ...state.ipsToNames };
            newIpsToNames[action.cert.addr] = action.cert.name;

            const newNamesToIps = { ...state.namesToIps };
            newNamesToIps[action.cert.name] = action.cert.addr;

            const newState = {
                ...state,
                foreignCerts: newForeignCerts,
                namesToIps: newNamesToIps,
                ipsToNames: newIpsToNames,
            };

            return newState;
        }
        case REP_SENT: {
            if (typeof action.cert === 'undefined' ||
                typeof action.name === 'undefined' ||
                typeof action.tmpPrivKey === 'undefined') {
                throw new Error('Cert or name or privkey undefined in REP_SENT');
            }

            const newNativeCerts = { ...state.nativeCerts };
            const newTmpPrivKeys = { ...state.tmpPrivKeys };

            newNativeCerts[action.name] = action.cert;
            newTmpPrivKeys[action.name] = action.tmpPrivKey;

            const newState = {
                ...state,
                nativeCerts: newNativeCerts,
                tmpPrivKeys: newTmpPrivKeys,
            };

            return newState;
        }
        case REP_RECV: {
            if (typeof action.cert === 'undefined') {
                throw new Error('Cert undefined in REP_RECV');
            }

            const newForeignCerts = { ...state.foreignCerts };
            newForeignCerts[action.cert.name] = action.cert;

            const newState = {
                ...state,
                foreignCerts: newForeignCerts,
            };

            return newState;
        }
        case SECRET_EST: {
            if (typeof action.name === 'undefined' || typeof action.secret === 'undefined') {
                throw new Error('Name or secret undefined in SECRET_EST');
            }

            const newSecrets = { ...state.secrets };
            newSecrets[action.name] = action.secret;

            const newState = {
                ...state,
                secrets: newSecrets,
            };

            return newState;
        }
        default:
            return state;
    }
}

export default networkApp;
