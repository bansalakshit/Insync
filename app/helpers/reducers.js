import createConstants from './constants'

const createReducer = (_str) => {

    let constants = createConstants(_str)

    return function (state = {
        [`${_str}_loading`]: true,
        [`${_str}_error`]: false,
        [`${_str}_data`]: []
    }, action) {
        switch (action.type) {
            case constants.REQUEST_LOADING:
                return {
                    [`${_str}_loading`]: true,
                    [`${_str}_error`]: false
                };
            case constants.REQUEST_SUCCESS:
                return {
                    [`${_str}_loading`]: false,
                    [`${_str}_error`]: false,
                    [`${_str}_data`]: (action.payload && action.payload.data) ? action.payload.data : []
                };
            case constants.REQUEST_FAILURE:
                return {
                    ...state,
                    [`${_str}_loading`]: false,
                    [`${_str}_error`]: true
                };
            default:
                return state
        }
    }

}

export default createReducer