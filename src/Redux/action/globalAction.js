import {
    LOADING,
    GUIDE,
    LOGIN,
    REGISTER,
    LOGOUT,
    API_LOADING,
    USER_UPDATE
} from '../actionType'

import APIKit, {setClientToken} from '../../Config/APIKit'

import {showAlert} from '../../Redux/action/AlertAction'
import AsyncStorage from '@react-native-community/async-storage'

export const setLoading = (loading) => dispatch => {
    dispatch({
        type: LOADING,
        payload: loading
    })
}

export const setApiLoading = (apiLoading) => dispatch => {
    dispatch({
        type: API_LOADING,
        payload: apiLoading
    })
}

export const setGuide = (loading) => dispatch => {
    dispatch({
        type: GUIDE,
        payload: loading
    })
}

export const login = (data) => dispatch => {
    dispatch(setApiLoading(true))

    APIKit.post('auth/login', data)
    .then( (res) => {
        dispatch(setApiLoading(false))

        const data = res.data
        if(!data) {
            return
        }

        const status = data.status

        if(status === true) {
            const user = data.results
            AsyncStorage.setItem('token', user.token)
            setClientToken(user.token)
            dispatch({
                type: LOGIN,
                payload: user
            })
        } else {
            dispatch(showAlert({message: data.msg}))
        }
    })
    .catch(error => {
        dispatch(setApiLoading(false))
        dispatch(showAlert({message: error.message}))
        console.log('auth/login', error.message)
    })

}

export const loginByToken = () => dispatch => {
    APIKit.post('users/login-auto')
    .then( (res) => {
        const data = res.data
        if(!data) {
            return
        }

        const status = data.status
        if(status === true) {
            const user = data.results
            AsyncStorage.setItem('token', user.token)
            setClientToken(user.token)
            dispatch({
                type: LOGIN,
                payload: user
            })
        } else {
            dispatch(showAlert({message: data.msg}))
        }
    })
    .catch(error => {
        dispatch(setApiLoading(false))
        console.log('users/login-auto', error.message)
    })

}

export const logout = () => dispatch => {
    AsyncStorage.removeItem('token')
    dispatch({
        type: LOGOUT
    })
}

export const userUpdate = (data, callback = null) => dispatch => {
    dispatch(setApiLoading(true))

    APIKit.post('users/update-profile', data)
    .then( (res) => {
        dispatch(setApiLoading(false))

        const data = res.data
        if(!data) {
            return
        }

        const status = data.status
        if(status === true) {
            const user = data.results
            console.log('users/update-profile', user)
            dispatch({
                type: USER_UPDATE,
                payload: user
            })
            if(callback) {
                callback()
            }
        } else {
            dispatch(showAlert({message: data.msg}))
        }
    })
    .catch(error => {
        dispatch(setApiLoading(false))
        dispatch(showAlert({message: error.message}))
        console.log('users/update-profile', error.message)
    })

}

export const userUpdate_Local = (data) => dispatch => {
    dispatch({
        type: USER_UPDATE,
        payload: data
    })
}

export const forgotPassword = (payload) => dispatch => {
    dispatch(setApiLoading(true))

    APIKit.post('auth/forgot-password', payload)
    .then( (res) => {
        dispatch(setApiLoading(false))

        const data = res.data
        if(!data) {
            return
        }

        const status = data.status
        if(status === true) {
            dispatch(showAlert({message: data.msg, confirmAction: payload.handler}))
        } else {
            dispatch(showAlert({message: data.msg}))
        }
    })
    .catch(error => {
        dispatch(setApiLoading(false))
        console.log('auth/login', error.message)
    })

}

export const register = (data) => dispatch => {
    dispatch(setApiLoading(true))

    APIKit.post('auth/login', data)
    .then( (res) => {
        dispatch(setApiLoading(false))

        const data = res.data
        if(!data) {
            return
        }

        const status = data.status
        if(status === true) {
            const user = data.results
            AsyncStorage.setItem('token', user.token)
            setClientToken(user.token)
            dispatch({
                type: REGISTER,
                payload: user
            })
        } else {
            dispatch(showAlert({message: data.msg}))
        }
    })
    .catch(error => {
        dispatch(setApiLoading(false))
        console.log('auth/register', error.message)
    })

}

export const emailValidate = (payload) => dispatch => {
    dispatch(setApiLoading(true))

    APIKit.post('auth/email-validate', payload)
    .then( (res) => {
        dispatch(setApiLoading(false))

        const data = res.data
        if(!data) {
            return
        }

        console.log(data)
        const status = data.status
        payload.callback(status, data.msg)
    })
    .catch(error => {
        dispatch(setApiLoading(false))
        console.log('auth/email-validate', error.message)
    })

}

