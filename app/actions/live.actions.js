import { liveConstants } from "../constants";
import { alertActions } from "./";
import { logService } from "../services";

const searchEmployees = _searchText => {
    return {
        type: liveConstants.SEARCHED,
        payload: {
            data: _searchText
        }
    };
};

const changeJob = _jobId => {
    return {
        type: liveConstants.JOB_CHANGED,
        payload: {
            data: _jobId
        }
    };
};


const changeUser = _user => {
    return {
        type: liveConstants.USER_CHANGED,
        payload: {
            data: _user
        }
    };
};


const getLive = (_jobId = "all", _showLoader = true) => {
    return dispatch => {
        if (_showLoader) dispatch({ type: liveConstants.EMPLOYEES_LOADING });
        logService.live(_jobId).then(
            _res => {
                dispatch({
                    type: liveConstants.EMPLOYEES_SUCCESS,
                    payload: {
                        data: _res
                    }
                });
            },
            _err => {
                dispatch({ type: liveConstants.EMPLOYEES_FAILURE });
                dispatch(alertActions.error(_err));
            }
        );
    };
};

export const liveActions = {
    searchEmployees,
    changeJob,
    changeUser,
    getLive
};
