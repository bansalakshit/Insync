import {
    configConstants
} from '../constants'

export function config(state = {
    loadingConfig: false,
    errorConfig: false,
    dataConfig: {}
}, action) {
    switch (action.type) {
        case configConstants.REQUEST_LOADING:
            return {
                loadingConfig: true,
                errorConfig: false
            };
        case configConstants.REQUEST_SUCCESS:
            return {
                loadingConfig: false,
                errorConfig: false,
                dataConfig: (action.payload && action.payload.data) ? action.payload.data : {}
            };
        case configConstants.REQUEST_FAILURE:
            return {
                ...state,
                loadingConfig: false,
                errorConfig: true
            };
        default:
            return state
    }
}