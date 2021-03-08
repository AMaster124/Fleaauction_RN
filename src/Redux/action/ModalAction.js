import {
    SELECT_FILTER,
    SHOW_INPUT_BID,
    SHOW_PHOTO_SELECTION,
    SHOW_COUPON_SELECTION
} from '../actionType'

export const showFilterModal = (show) => dispatch => {
    dispatch({
        type: SELECT_FILTER,
        payload: show
    })
}

export const showInputBid = (payload) => dispatch => {
    dispatch({
        type: SHOW_INPUT_BID,
        payload: payload
    })
}

export const showPhotoSelection = (payload) => dispatch => {
    dispatch({
        type: SHOW_PHOTO_SELECTION,
        payload: payload
    })
}

export const showCouponSelection = (payload) => dispatch => {
    dispatch({
        type: SHOW_COUPON_SELECTION,
        payload: payload
    })
}