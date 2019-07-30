import Router from 'next/router'
import { authConstants } from '../constants'
import { alertActions } from './'
import { userService } from '../services'

export const userActions = {
    getProfile
}

function getProfile() {
    return dispatch =>{
        userService.profile().then(
            _res =>{
                Router.push({
                    pathname: '/home'
                })
            },
            _err => {
                dispatch(alertActions.error(_err))
                if(_err === 'Unauthorized user. Please sign in.') {
                    localStorage.removeItem('user')
                    dispatch({ type: authConstants.LOGOUT })
                    Router.push({
                        pathname: '/'
                    })
                }
            }
        )
    }
}
