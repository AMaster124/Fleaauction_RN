import axios from 'axios'
// import * as URL from './URLs'

export const SERVER_URL = 'http://192.168.1.6:3000/';
export const BASE_URL = 'http://192.168.1.6:7000/api/';
export const SOCKET_URL = 'http://192.168.1.6:7000';

// export const SERVER_URL = 'http://13.209.5.110:3000/';
// export const BASE_URL = 'http://13.209.5.110:7000/api/';
// export const SOCKET_URL = 'http://13.209.5.110:7000';

export const IMAGE_URL = `${BASE_URL}storage/uploads/`;

let APIKit = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
    headers: {"Content-Type": 'application/json'}
});

// setJSON web token in client to be included in all calls
export const setClientToken = token => {
    console.log(token)
    return new Promise((resolve) => {
        // do something asynchronous which eventually calls either:
        if (token) {
            APIKit.defaults.headers.Authorization = token;
        resolve();
        } else {
            delete APIKit.defaults.headers.Authorization;
        resolve();
        }
    });
    // APIKit.interceptors.request.use(function(config) {
    //     config.headers.Authorization = token;
    //     return config;
    // });
};

export function addTokenToHttp(token) {
    return new Promise((resolve) => {
    // do something asynchronous which eventually calls either:
    if (token) {
    request.defaults.headers.Authorization = `Bearer ${token}`;
    resolve();
    } else {
    delete request.defaults.headers.Authorization;
    resolve();
    }
    });
    }

export default APIKit;