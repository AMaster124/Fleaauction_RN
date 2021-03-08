import {
    SELECT_FILTER,
    SHOW_INPUT_BID,
    SHOW_PHOTO_SELECTION,
    SHOW_COUPON_SELECTION
} from '../actionType'

const initState = {
    showFilter: false,
    selectedFilter: 0,
    bidPrice: 0,
    bidUnit: 0,
    showBid: false,
    showPhotoSelection: false,
    showCouponSelection: false,
}

export default function modalReducer( state = initState, action = {} ) {
    const payload = action.payload
    switch(action.type) {
        case SELECT_FILTER:
            return {
                ...state,
                showFilter: payload.show,
                selectedFilter: payload.selected
            }
        case SHOW_INPUT_BID:
            return {
                ...state,
                showBid: payload.show,
                bidPrice: payload.price,
                bidUnit: payload.unit
            }
        case SHOW_PHOTO_SELECTION:
            return {
                ...state,
                showPhotoSelection: payload,
            }
        case SHOW_COUPON_SELECTION:
            return {
                ...state,
                showCouponSelection: payload,
            }
        default:
            return state
    }
}