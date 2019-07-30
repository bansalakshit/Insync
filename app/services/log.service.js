
import { commonService } from './common.service'
import { authHeader } from '../helpers'

function list(_sort) {
    if(!_sort)
        _sort = 'DESC'
    return commonService.getRequest('/log', [_sort], authHeader())
}

function screenshots(_freelancerId, _start, _end) {
    return commonService.postRequest(`/log/screenshots/${_freelancerId}`, {start: _start, end: _end}, authHeader())
}

function live(_jobId) {
    return commonService.getRequest('/log/live/screenshots', [_jobId], authHeader())
}

function month(_freelancerId, _start, _end) {
    return commonService.postRequest(`/log/month/${_freelancerId}`, {start: _start, end: _end}, authHeader())
}

function myScreenshots(_employeerId, _jobId, _start, _end) {
    return commonService.postRequest(`/log/my-screenshots`, {employeer: _employeerId, job: _jobId, start: _start, end: _end}, authHeader())
}

export const logService = {
    month,
    live,
    list,
    screenshots,
    myScreenshots,
}