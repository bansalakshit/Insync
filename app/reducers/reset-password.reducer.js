import {
    resetPasswordConstants
} from '../constants';

export function resetPassword(state = {
    validating: false,
    valid: false
}, action) {
    switch (action.type) {
        case resetPasswordConstants.VALIDATING_TOKEN:
            return {
                validating: true,
                valid: false
            };
        case resetPasswordConstants.VALIDATION_DONE:
            return {
                validating: false,
                valid: action.valid
            };
        default:
            return state
    }
}