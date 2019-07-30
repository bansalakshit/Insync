import {
  authConstants
} from '../constants'

let user = typeof localStorage !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : null
const initialState = user ? {
  loggedIn: true,
  user
} : {}

export function authentication(state = initialState, action) {
    switch (action.type) {
        case authConstants.LOGIN_REQUEST:
            return {
              loggingIn: true,
              user: action.user
            }
        case authConstants.LOGIN_SUCCESS:
            return {
              loggedIn: true,
              user: action.user
            }
        case authConstants.LOGIN_FAILURE:
            return {}
        case authConstants.LOGOUT_FAILURE:
            return {}
        case authConstants.LOGOUT:
            return {}
        default:
            return state
    }
}