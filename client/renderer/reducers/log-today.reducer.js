import {
    logTodayConstants
} from '../constants'

export function logToday(state = {
    totalSeconds: 0
}, action) {
    switch (action.type) {
        case logTodayConstants.REQUEST_SUCCESS:
            return {
                totalSeconds: action.payload.data
            }
        default:
            return state
    }
}