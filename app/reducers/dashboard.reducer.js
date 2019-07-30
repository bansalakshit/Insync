import {
    dashboardConstants
} from '../constants';

export function dashboard(state = {
    loading: false,
    error: false,
    list: []
}, action) {
    switch (action.type) {
        case dashboardConstants.REQUEST_LOADING:
            return {
                loading: true,
                error: false
            };
        case dashboardConstants.REQUEST_SUCCESS:
            return {
                loading: false,
                error: false,
                list: (action.payload && action.payload.list) ? action.payload.list : []
            };
        case dashboardConstants.REQUEST_FAILURE:
            return {
                ...state,
                loading: false,
                error: true
            };
        default:
            return state
    }
}