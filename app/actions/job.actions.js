import { requestConstants } from '../constants'
import { alertActions } from './'
import { jobService } from '../services'
import createConstants from '../helpers/constants'

const getJobs = () => {
    let constants = createConstants('jobs')
    return dispatch =>{
        dispatch({type: constants.REQUEST_LOADING})
        jobService.jobs().then(
            _res =>{
                dispatch({
                    type: constants.REQUEST_SUCCESS,
                    payload: {
                        data: _res
                    }
                })
            },
            _err => {
                dispatch({type: constants.REQUEST_FAILURE})
                dispatch(alertActions.error(_err))
            }
        )
    }
}

const getTasks = (_jobId, _showLoader=true) => {
    let constants = createConstants('job_tasks')

    return dispatch =>{
        if(_showLoader)
            dispatch({type: constants.REQUEST_LOADING})
        jobService.tasks(_jobId).then(
            _res =>{
                dispatch({
                    type: constants.REQUEST_SUCCESS,
                    payload: {
                        data: _res
                    }
                })
            },
            _err => {
                dispatch({type: constants.REQUEST_FAILURE})
                dispatch(alertActions.error(_err))
            }
        )
    }
}

const getList = _action => {
    return dispatch =>{
        dispatch({type: requestConstants.REQUEST_LOADING})
        jobService[_action]().then(
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

const acceptInvitation = _hash => {
    return dispatch =>{
        dispatch({type: requestConstants.REQUEST_LOADING})
        jobService.accept(_hash).then(
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

const join = (_token, _path) => {
    return dispatch =>{
        dispatch({type: requestConstants.REQUEST_LOADING})
        jobService.join(_token).then(
            _res =>{
                dispatch({
                    type: requestConstants.REQUEST_SUCCESS,
                    payload: {
                        list: _res
                    }
                })
            },
            _err => {
                localStorage.setItem('redirect', _path)
                dispatch({type: requestConstants.REQUEST_FAILURE})
                dispatch(alertActions.error(_err))
            }
        )
    }
}

const getEmployees = _jobId => {
    let constants = createConstants('employees')
    return dispatch =>{
        dispatch({type: constants.REQUEST_LOADING})
        jobService.employees(_jobId).then(
            _res =>{
                dispatch({
                    type: constants.REQUEST_SUCCESS,
                    payload: {
                        data: _res
                    }
                })
            },
            _err => {
                dispatch({type: constants.REQUEST_FAILURE})
                dispatch(alertActions.error(_err))
            }
        )
    }
}

export const jobActions = {   
    getJobs,
    getTasks,
    getList,
    acceptInvitation,
    join,
    getEmployees
}