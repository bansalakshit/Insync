import {
    requestConstants
} from '../constants'

export function request(state = {
    loading: false,
    error: false,
    list: []
}, action) {
    switch (action.type) {
        case requestConstants.REQUEST_LOADING:
            return {
                loading: true,
                error: false
            };
        case requestConstants.REQUEST_SUCCESS:
            return {
                loading: false,
                error: false,
                list: (action.payload && action.payload.list) ? action.payload.list : []
            };
        case requestConstants.REQUEST_FAILURE:
            return {
                ...state,
                loading: false,
                error: true
            };
        default:
            return state
    }
}