import { requestConstants, dashboardConstants } from "../constants";
import { alertActions } from "./";
import { logService } from "../services";

const getLive = (_jobId='all', _showLoader = true) => {
    return dispatch => {
        if (_showLoader) dispatch({ type: requestConstants.REQUEST_LOADING });
        logService.live(_jobId).then(
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

const getScreenshots = (_freelancerId, _start, _end) => {
    return dispatch => {
        dispatch({ type: requestConstants.REQUEST_LOADING });
        logService.screenshots(_freelancerId, _start, _end).then(
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

const getList = (_sortDir, _showLoader = true) => {
    return dispatch => {
        if (_showLoader) dispatch({ type: dashboardConstants.REQUEST_LOADING });
        logService.list(_sortDir).then(
            _res => {
                dispatch({
                    type: dashboardConstants.REQUEST_SUCCESS,
                    payload: {
                        list: _res
                    }
                });
            },
            _err => {
                dispatch({ type: dashboardConstants.REQUEST_FAILURE });
                dispatch(alertActions.error(_err));
            }
        );
    };
};

export const logActions = {
    getLive,
    getList,
    getScreenshots
};
