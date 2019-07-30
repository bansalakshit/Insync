import { apiConfig } from '../config'
import { handleResponse, authHeader} from '../helpers'

export const authService = {
    login,
    logout,
    register,
    forgotPassword,
    validateResetToken,
    resetPassword,
    activateAccount
}

function login(identity, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',  'src': 'web' },
        credentials: 'include',
        body: JSON.stringify({ email: identity, password: password })
    }

    return fetch(`${apiConfig.apiUrl}/auth/login`, requestOptions)
        .then(handleResponse)
        .then(res => {
            let info = res.user
            let user = res.user;
            user.token = res.token;
            if (res.success) {
                localStorage.setItem('user', JSON.stringify(user))
            }

            return info
        })
}

function logout() {
    const requestOptions = {
        method: 'GET',
        credentials: 'include',
        headers: Object.assign({ 'Content-Type': 'application/json'}, {'src': 'web'}, authHeader())
    }

    return fetch(`${apiConfig.apiUrl}/auth/logout`, requestOptions)
        .then(handleResponse)
        .then(res => {
            return res
        })
}

function register(_user) {
    const requestOptions = {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json',  'src': 'web' },
        body: JSON.stringify(_user)
    }

    return fetch(`${apiConfig.apiUrl}/auth/register`, requestOptions).then(handleResponse)
}


function forgotPassword(_email) {
    const requestOptions = {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json',  'src': 'web' },
        body: JSON.stringify({email: _email})
    }

    return fetch(`${apiConfig.apiUrl}/auth/forgot-password`, requestOptions).then(handleResponse)
}

function validateResetToken(_token) {
    const requestOptions = {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json',  'src': 'web' }
    }

    return fetch(`${apiConfig.apiUrl}/auth/validate-reset-token/${_token}`, requestOptions)
        .then(handleResponse)
        .then(res => {
            return res
        })
}


function resetPassword(_token, _password, _confirmPassword) {
    const requestOptions = {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json',  'src': 'web' },
        body: JSON.stringify({password: _password, confirmPassword: _confirmPassword})
    }

    return fetch(`${apiConfig.apiUrl}/auth/reset-password/${_token}`, requestOptions)
        .then(handleResponse)
        .then(res => {
            return res
        })
}


function activateAccount(_token) {
    const requestOptions = {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json',  'src': 'web' }
    }

    return fetch(`${apiConfig.apiUrl}/auth/activate/${_token}`, requestOptions)
        .then(handleResponse)
        .then(res => {
            return res
        })
}


// function update(user) {
//     const requestOptions = {
//         method: 'PUT',
//         headers: { ...authHeader(), 'Content-Type': 'application/json' },
//         body: JSON.stringify(user)
//     }

//     return fetch(`${apiConfig.apiUrl}/users/${user.id}`, requestOptions).then(handleResponse)
// }

// // prefixed function name with underscore because delete is a reserved word in javascript
// function _delete(id) {
//     const requestOptions = {
//         method: 'DELETE',
//         headers: authHeader()
//     }

//     return fetch(`${apiConfig.apiUrl}/users/${id}`, requestOptions).then(handleResponse)
// }
