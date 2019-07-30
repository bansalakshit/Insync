import {
  userConstants
} from '../constants';

export function user(state = {
  profile: {}
}, action) {
  switch (action.type) {
    case userConstants.GET_PROFILE:
      return {
        ...state,
        profile: action.payload.profile
      };
    case userConstants.UPDATE_PROFILE_REQUEST:
      return {
        ...state,
        isUpdating: true
      };
    case userConstants.UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        isUpdating: false
      };
    default:
      return state
  }
}