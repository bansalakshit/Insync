

export function authHeader() {
    // return authorization header with jwt token
    let user = JSON.parse(localStorage.getItem('user'));

    if (user && user.token) {
        return { 'Authorization': 'Bearer ' + user.token };
    } else {
        return {};
    }
}

export function isUser(_id) {
    let user = JSON.parse(window.localStorage.getItem('user'));
    return user._id === _id;
}

export function isLoggedIn() {
    let user = JSON.parse(window.localStorage.getItem('user'));
    return user && user._id;
}


export function userInfo() {
    return JSON.parse(window.localStorage.getItem('user'))
}