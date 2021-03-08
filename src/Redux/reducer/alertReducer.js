import {
    SHOW_ALERT,
    HIDE_ALERT
} from '../actionType'

const initState = {
    isOpen: false,
    message: '',
    isConfirm: false,
    confirmTitle: '확인',
    cancelTitle: '취소',
    confirmAction: () => {},
    cancelAction: () => {}
}

export default function alertReducer( state = initState, action = {} ) {
    const payload = action.payload
    switch(action.type) {
        case SHOW_ALERT:
            return {
                ...state,
                isOpen: true,
                title: payload.title,
                message: payload.message ? payload.message : "",
                isConfirm: payload.isConfirm != null ? payload.isConfirm : false,
                confirmTitle: payload.confirmTitle != null ? payload.confirmTitle : '확인',
                cancelTitle: payload.cancelTitle != null ? payload.cancelTitle : '취소',
                confirmAction: payload.confirmAction != null ? payload.confirmAction : ()=>{},
                cancelAction: payload.cancelAction != null ? payload.cancelAction : ()=>{},
            }
        case HIDE_ALERT:
            return {
                ...state,
                isOpen: false,
            }
        default:
            return state
    }
}