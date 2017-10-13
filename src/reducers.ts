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
import { ICert, ISocket } from './types';

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

interface IState {
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

interface IAction {
    type: string;
    socket?: ISocket;
    cert?: ICert;
    name?: string;
    secret?: string;
    addr?: string;
    names?: string[];
    tmpPrivKey?: string;
}

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
                throw new Error('Cert or name undefined in REP_RECV');
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

        // case OUT_OPEN: {
        //     if (typeof action.socket === 'undefined') {
        //         throw new Error('Socket undefined in OUT_OPEN');
        //     }

        //     const newState = { ...state };
        //     const newOutConns = { ...state.outConns };
        //     newOutConns[action.socket.name] = action.socket;

        //     newState.outConns = newOutConns;

        //     return newState;
        // }
        // case GEN_CERT: {
        //     if (typeof action.cert === 'undefined') {
        //         throw new Error('Cert undefined in GEN_CERT');
        //     }

        //     const newState = { ...state };
        //     const newOutCerts = { ...state.outCerts };
        //     newOutCerts[action.cert.recip] = action.cert;

        //     newState.outCerts = newOutCerts;

        //     return newState;
        // }
        // case IN_OPEN: {
        //     if (typeof action.socket === 'undefined') {
        //         throw new Error('Socket undefined in IN_OPEN');
        //     }

        //     if (typeof action.cert === 'undefined') {
        //         throw new Error('Cert undefined in IN_OPEN');
        //     }

        //     const newState = { ...state };

        //     const newOutConns = { ...state.outConns };
        //     newOutConns[action.socket.name] = action.socket;

        //     newState.outConns = newOutConns;

        //     const newInCerts = { ...state.inCerts };
        //     newInCerts[action.socket.name] = action.cert;

        //     newState.inCerts = newInCerts;

        //     return newState;
        // }
        // case SECRET_EST: {
        //     if (typeof action.secret === 'undefined') {
        //         throw new Error('Secret undefined in SECRET_EST');
        //     }

        //     if (typeof action.name === 'undefined') {
        //         throw new Error('Name undefined in SECRET_EST');
        //     }

        //     const newState = { ...state };

        //     const newSecrets = { ...state.secrets };
        //     newSecrets[action.name] = action.secret;

        //     newState.secrets = newSecrets;

        //     return newState;
        // }
        default:
            return state;
    }
}

export default networkApp;
