import { apiConfig } from '../config'
import { handleResponse, authHeader } from '../helpers'

export const authService = {
    login,
    logout
}

function login(identity, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'src': 'app' },
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
        headers: Object.assign({ 'Content-Type': 'application/json'}, {'src': 'app'}, authHeader())
    }

    return fetch(`${apiConfig.apiUrl}/auth/logout`, requestOptions)
        .then(handleResponse)
        .then(res => {
            return res
        })
}