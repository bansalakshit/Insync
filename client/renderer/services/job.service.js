
import { commonService } from './common.service'
import { authHeader } from '../helpers'

function list() {
    return commonService.getRequest('/job/freelancer', '', authHeader())
}

function screenshot(_data) {
    return commonService.postRequest('/log/screenshot', _data, authHeader())
}

function log(_data) {
    return commonService.postRequest('/log', _data, authHeader())
}

function stopLog(_data) {
    return commonService.postRequest('/log/stop', _data, authHeader())
}

function updateLog(_data) {
    return commonService.postRequest('/log/update/screenshots', _data, authHeader())
}

function logToday(_jobId) {
    return commonService.getRequest('/log/today/user', [_jobId], authHeader())
}

function userTasks(_jobId) {
    return commonService.getRequest(`/log/tasks`, [_jobId], authHeader())
}

function doneTask(_taskId) {
    return commonService.getRequest(`/job/tasks/done`, [_taskId], authHeader())
}

function createTask(_jobId, _data) {
    return commonService.postRequest(`/job/tasks/create/${_jobId}`, _data, authHeader())
}

export const jobService = {
    createTask,
    doneTask,
    userTasks,
    list,
    updateLog,
    log,
    stopLog,
    logToday,
    screenshot
}

