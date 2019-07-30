
import { commonService } from './common.service'
import { authHeader } from '../helpers'


const jobs = () => {
    return commonService.getRequest('/job/list', '', authHeader())
}

const list = () => {
    return commonService.getRequest('/job', '', authHeader())
}

const freelancer = () => {
    return commonService.getRequest('/job/freelancer', '', authHeader())
}

const create = _data => {
    return commonService.postRequest('/job', _data, authHeader())
}

const invite = (_jobId, _data) => {
    return commonService.postRequest(`/job/invite-freelancer/${_jobId}`, _data, authHeader())
}

const accept = _hash => {
    return commonService.getRequest(`/job/accept-invitation`, [_hash], authHeader())
}

const join = _token => {
    return commonService.getRequest(`/job/join/${_token}`, '', authHeader())
}

const archiveFreelancer = (_jobId, _userId) => {
    return commonService.getRequest('/job/archive', [_jobId, _userId], authHeader())
}

const tasks = _jobId => {
    return commonService.getRequest('/job/tasks/list', [_jobId], authHeader())
}

const createTask = (_jobId, _data) => {
    return commonService.postRequest(`/job/tasks/create/${_jobId}`, _data, authHeader())
}

const assignTask = (_jobId, _taskId, _users) => {
    return commonService.postRequest(`/job/tasks/assign/${_jobId}/${_taskId}`, _users, authHeader())
}

const removeTask = (_jobId, _taskId, _userId) => {
    return commonService.getRequest(`/job/tasks/remove`, [_jobId, _taskId, _userId], authHeader())
}

const updateTask = (_taskId, _data) => {
    return commonService.postRequest(`/job/tasks/update/${_taskId}`, _data, authHeader())
}

const employees = _jobId => {
    return commonService.getRequest('/job/employees', [_jobId], authHeader())
}

const userTasks = _userId => {
    return commonService.getRequest(`/job/user-tasks`, [_userId], authHeader())
}

const userJobs = _userId => {
    return commonService.getRequest(`/job/user-jobs`, [_userId], authHeader())
}

const newManager = (_jobId, _email) => {
    return commonService.postRequest(`/job/manager/${_jobId}/new`, {email: _email}, authHeader())
}

const removeManager = (_jobId, _userId) => {
    return commonService.getRequest(`/job/manager/${_jobId}/remove/${_userId}`, '', authHeader())
}

export const jobService = {
    jobs,
    userJobs,
    userTasks,
    updateTask,
    employees,
    archiveFreelancer,
    tasks,
    createTask,
    assignTask,
    removeTask,
    list,
    freelancer,
    create,
    invite,
    accept,
    join,
    newManager,
    removeManager
}