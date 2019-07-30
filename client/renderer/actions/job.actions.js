import { requestConstants, logTodayConstants } from '../constants'
import { alertActions } from './'
import { jobService } from '../services'

export const jobActions = {   
    getList,
    getLogToday
}


function getLogToday(_jobId) {
    return dispatch =>{
        dispatch({type: logTodayConstants.REQUEST_LOADING})
        jobService.logToday(_jobId).then(
            _res =>{
                dispatch({
                    type: logTodayConstants.REQUEST_SUCCESS,
                    payload: {
                        data: _res.data
                    }
                })
            },
            _err => {
                dispatch({type: logTodayConstants.REQUEST_FAILURE})
            }
        )
    }
}

function getList() {
    return dispatch =>{
        dispatch({type: requestConstants.REQUEST_LOADING})
        jobService.list().then(
            _res =>{
                dispatch({
                    type: requestConstants.REQUEST_SUCCESS,
                    payload: {
                        list: _res
                    }
                })
            },
            _err => {
                dispatch({type: requestConstants.REQUEST_FAILURE})
                dispatch(alertActions.error(_err))
            }
        )
    }
}