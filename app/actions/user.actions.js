import Router from "next/router";
import { userConstants, requestConstants, authConstants } from "../constants";
import { alertActions } from "./";
import { userService } from "../services";

const getList = () => {
    return dispatch => {
        dispatch({ type: requestConstants.REQUEST_LOADING });
        userService.list().then(
            _res => {
                dispatch({
                    type: requestConstants.REQUEST_SUCCESS,
                    payload: {
                        list: _res
                    }
                });
            },
            _err => {
                dispatch({ type: requestConstants.REQUEST_FAILURE });
                dispatch(alertActions.error(_err));
            }
        );
    };
};

const getProfile = () => {
    return dispatch => {
        userService.profile().then(
            _res => {
                dispatch({
                    type: userConstants.GET_PROFILE,
                    payload: {
                        profile: _res
                    }
                });
            },
            _err => {
                dispatch(alertActions.error(_err));
                if (_err === "Unauthorized user. Please sign in.") {
                    localStorage.removeItem("user");
                    dispatch({ type: authConstants.LOGOUT });
                    Router.push({
                        pathname: "/login"
                    });
                }
            }
        );
    };
};

const updateProfile = _data => {
    return dispatch => {
        dispatch({
            type: userConstants.UPDATE_PROFILE_REQUEST
        });
        userService.updateProfile(_data).then(
            _res => {
                dispatch({
                    type: userConstants.UPDATE_PROFILE_SUCCESS
                });
                dispatch(getProfile());
            },
            _err => {
                dispatch(alertActions.error(_err));
                if (_err === "Unauthorized user. Please sign in.") {
                    localStorage.removeItem("user");
                    dispatch({ type: authConstants.LOGOUT });
                    Router.push({
                        pathname: "/login"
                    });
                }
            }
        );
    };
};

export const userActions = {
    getProfile,
    updateProfile,
    getList
};
