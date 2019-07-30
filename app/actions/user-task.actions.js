import createConstants from "../helpers/constants";
import { alertActions } from "./";
import { jobService } from "../services";

const getUserTasks = _userId => {
    let constants = createConstants("user_tasks");

    return dispatch => {
        dispatch({ type: constants.REQUEST_LOADING });
        jobService.userTasks(_userId).then(
            _res => {
                dispatch({
                    type: constants.REQUEST_SUCCESS,
                    payload: {
                        data: _res
                    }
                });
            },
            _err => {
                dispatch({ type: constants.REQUEST_FAILURE });
                dispatch(alertActions.error(_err));
            }
        );
    };
};

export const userTaskActions = {
    getUserTasks
};
