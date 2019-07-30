import { authConstants } from '../constants'
import { authService } from '../services'
import { alertActions } from './'
import Router from 'next/router'

export const authActions = {
    login,
    logout
}

function login(identity, password) {
    return dispatch => {
        dispatch(request(null))

        authService.login(identity, password)
            .then(
                _res => { 
                    dispatch(success(_res))
                    let path = localStorage.getItem('redirect')
                    if(path && path.trim() !== '') {
                        localStorage.setItem('redirect', '')
                        Router.push({
                            pathname: path
                        })
                    } else {
                        Router.push({
                            pathname: '/home'
                        })
                    }
                }
            )
            .catch(error => {
                dispatch(failure(error.toString()))
                dispatch(alertActions.error(error))
            })
    }

    function request(user) { return { type: authConstants.LOGIN_REQUEST, user } }
    function success(user) { return { type: authConstants.LOGIN_SUCCESS, user } }
    function failure(error) { return { type: authConstants.LOGIN_FAILURE, error } }
}

function logout() {

    return dispatch => {
        authService.logout()
            .then(
                res => { 
                    dispatch(success())
                    localStorage.removeItem('user')
                    Router.push({
                        pathname: '/'
                    })
                },
                error => {
                    dispatch(success())
                    localStorage.removeItem('user')
                    Router.push({
                        pathname: '/'
                    })
                }
            )
    }

    function success() { return { type: authConstants.LOGOUT } }
    function failure(error) { return { type: authConstants.LOGOUT_FAILURE, error } }

}
