import {applyMiddleware, createStore} from 'redux'
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';
import { persistStore } from 'redux-persist';

import reducer from '../reducer';
import * as env from '../../Config/environment';
import thunk from 'redux-thunk';

export const client = axios.create({
    baseURL: env.API_URL,
    responseType: "json",
    timeout: 5000
});

const axiosMiddlewareOptions = {
    interceptors: {
        request: [
            ({ getState, dispatch }, config) => {
                return config;
            }
        ],
        response: [
            {
                success: ({getState, dispatch}, response) => {
                    return response;
                },
                error: ({ getState, dispatch }, error) => {
                    return Promise.reject(error);
                }
            }
        ]
    }
}

const middlewares = [];
middlewares.push(axiosMiddleware(client, axiosMiddlewareOptions));
middlewares.push(thunk);

const store = createStore(reducer, applyMiddleware(...middlewares));
const persistor = persistStore(store);

export default { store, persistor };

// export default () => {
//     const store = createStore(reducer, applyMiddleware(...middlewares));
//     const persistor = persistStore(store);
//     return { store, persistor };
// };