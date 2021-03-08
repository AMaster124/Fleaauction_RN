import { stat } from 'react-native-fs'
import {
    LOADING,
    GUIDE,
    LOGIN,
    LOGOUT,
    REGISTER,
    API_LOADING,
    USER_UPDATE
} from '../actionType'

const initState = {
    user: null,
    loading: true,
    loggedin: false,
    apiLoading: false,
    guide: true
}

export default function golbalReducer( state = initState, action = {} ) {
    const payload = action.payload
    console.log(payload)
    switch(action.type) {
        case LOADING:
            return {
                ...state,
                loading: payload
            }
        case GUIDE:
            return {
                ...state,
                guide: payload
            }
        case LOGIN:
            return {
                ...state,
                user: payload,
                loggedin: true
            }
        case LOGOUT:
            return {
                ...state,
                user: null,
                loggedin: false
            }
        case REGISTER:
            return {
                ...state,
                loggedin: true,
                user: payload
            }
        case USER_UPDATE:
            console.log('USER_UPDATE', { ...state.user, ...payload})
            return {
                ...state,
                user: { ...state.user, ...payload},
            }
        case API_LOADING:
            return {
                ...state,
                apiLoading: payload
            }
        default:
            return state
    }
}