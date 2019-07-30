import { authConstants } from "../constants";
import { requestConstants } from "../constants";
import { resetPasswordConstants } from "../constants";
import { authService } from "../services";
import { alertActions } from "./";
import Router from "next/router";

const login = (_identity, _password) => {
    return dispatch => {
        dispatch(request(null));

        authService
            .login(_identity, _password)
            .then(_res => {
                dispatch(success(_res));
                let path = localStorage.getItem("redirect");
                if (path && path.trim() !== "") {
                    localStorage.removeItem("redirect");
                    Router.push(path);
                } else {
                    Router.push({
                        pathname: "/"
                    });
                }
            })
            .catch(error => {
                dispatch(failure(error.toString()));
                dispatch(alertActions.error(error));
            });
    };
    function request(user) {
        return { type: authConstants.LOGIN_REQUEST, user };
    }
    function success(user) {
        return { type: authConstants.LOGIN_SUCCESS, user };
    }
    function failure(error) {
        return { type: authConstants.LOGIN_FAILURE, error };
    }
};

const logout = () => {
    return dispatch => {
        authService.logout().then(
            res => {
                dispatch(success());
                localStorage.clear();
                Router.push({
                    pathname: "/"
                });
                // window.location.reload(true)
            },
            error => {
                dispatch(success());
                localStorage.clear();
                Router.push({
                    pathname: "/"
                });
                // window.location.reload(true)
            }
        );
    };

    function success() {
        return { type: authConstants.LOGOUT };
    }
    function failure(error) {
        return { type: authConstants.LOGOUT_FAILURE, error };
    }
};

const register = _user => {
    return dispatch => {
        dispatch(request(_user));
        authService.register(_user).then(
            res => {
                dispatch(success());
                dispatch(alertActions.success(res.message));
                Router.push({
                    pathname: "/login"
                });
            },
            error => {
                dispatch(failure(error.toString()));
                dispatch(alertActions.error(error));
            }
        );
    };

    function request(message) {
        return { type: authConstants.REGISTER_REQUEST, message };
    }
    function success(message) {
        return { type: authConstants.REGISTER_SUCCESS, message };
    }
    function failure(error) {
        return { type: authConstants.REGISTER_FAILURE, error };
    }
};

const forgotPassword = _email => {
    return dispatch => {
        dispatch({
            type: requestConstants.REQUEST_LOADING
        });
        authService.forgotPassword(_email).then(
            res => {
                dispatch(success());
                dispatch(alertActions.success(res.message));
            },
            error => {
                dispatch(failure());
                dispatch(alertActions.error(error));
            }
        );
    };
    function success() {
        return { type: requestConstants.REQUEST_SUCCESS };
    }
    function failure() {
        return { type: requestConstants.REQUEST_FAILURE };
    }
};

const validateResetToken = _token => {
    return dispatch => {
        dispatch({
            type: resetPasswordConstants.VALIDATING_TOKEN
        });
        authService.validateResetToken(_token).then(
            res => {
                dispatch(done(true));
                dispatch(alertActions.success(res.message));
            },
            error => {
                dispatch(done(false));
                dispatch(alertActions.error(error));
            }
        );
    };
    function done(_valid) {
        return { type: resetPasswordConstants.VALIDATION_DONE, valid: _valid };
    }
};

const resetPassword = (_token, _password, _confirmPassword) => {
    return dispatch => {
        dispatch({
            type: requestConstants.REQUEST_LOADING
        });
        authService.resetPassword(_token, _password, _confirmPassword).then(
            res => {
                Router.push({
                    pathname: "/login"
                });
                dispatch(success());
                dispatch(alertActions.success(res.message));
            },
            error => {
                dispatch(failure());
                dispatch(alertActions.error(error));
            }
        );
    };
    function success() {
        return { type: requestConstants.REQUEST_SUCCESS };
    }
    function failure() {
        return { type: requestConstants.REQUEST_FAILURE };
    }
};

const activateAccount = _token => {
    return dispatch => {
        dispatch({
            type: requestConstants.REQUEST_LOADING
        });
        authService.activateAccount(_token).then(
            res => {
                dispatch(success());
                dispatch(alertActions.success(res.message));
            },
            error => {
                dispatch(failure());
                dispatch(alertActions.error(error));
            }
        );
    };
    function success() {
        return { type: requestConstants.REQUEST_SUCCESS };
    }
    function failure() {
        return { type: requestConstants.REQUEST_FAILURE };
    }
};

export const authActions = {
    login,
    logout,
    register,
    forgotPassword,
    validateResetToken,
    resetPassword,
    activateAccount
};