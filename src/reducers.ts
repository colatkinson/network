import { combineReducers } from 'redux';
import {
    ExtSock,
    SERVER_SOCK_OPEN,
} from './actions';

interface IState {
    readonly connections: {
        [uuid: string]: {};
    };
    readonly sockets: {
        [uuid: string]: ExtSock;
    };
    readonly newConnsServer: {
        [uuid: string]: boolean;
    };
}

const initialState: IState = {
    connections: {},
    newConnsServer: {},
    sockets: {},
};

interface IAction {
    type: string;
    socket?: ExtSock;
}

function networkApp(state = initialState, action: IAction) {
    switch (action.type) {
        case SERVER_SOCK_OPEN:
            if (typeof action.socket === 'undefined') {
                return state;
            }

            const socketsCopy = { ...state.sockets };
            socketsCopy[action.socket.uuid] = action.socket;

            const connsCopy = { ...state.connections };
            connsCopy[action.socket.uuid] = {};

            const newConnsCopy = { ...state.newConnsServer };
            newConnsCopy[action.socket.uuid] = true;

            const newState = {
                ...state,
                connections: connsCopy,
                sockets: socketsCopy,
            };

            // TODO: Determine connection schema

            return newState;
        default:
            return state;
    }
}

export default networkApp;
