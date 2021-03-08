import {
    SHOW_ALERT,
    HIDE_ALERT
} from '../actionType'

export const showAlert = (payload) => dispatch => {
    dispatch({
        type: SHOW_ALERT,
        payload: payload
    })
}

export const hideAlert = () => dispatch => {
    dispatch({
        type: HIDE_ALERT,
    })
}