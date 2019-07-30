import {
    trackerConstants
} from '../constants';

export function tracker(state = {
    tracking: false
}, action) {
    switch (action.type) {
        case trackerConstants.RUNNING:
            return {
                tracking: true
            }
        case trackerConstants.STOP:
            return {
                tracking: false
            }
        default:
            return state
    }
}