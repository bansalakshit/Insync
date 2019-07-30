import { combineReducers } from 'redux';

import { authentication } from './authentication.reducer';
import { registration } from './registration.reducer';
import { alert } from './alert.reducer';
import { user } from './user.reducer';
import { request } from './request.reducer';
import { resetPassword } from './reset-password.reducer';
import { dashboard } from './dashboard.reducer';
import { chat } from './chat.reducer';
import { live } from './live-page.reducer';

import createReducer from '../helpers/reducers'
const user_tasks = createReducer('user_tasks')
const user_jobs = createReducer('user_jobs')
const job_tasks = createReducer('job_tasks')
const jobs = createReducer('jobs')
const employees = createReducer('employees')

const rootReducer = combineReducers({
    authentication,
    registration,
    alert,
    user,
    request,
    dashboard,
    resetPassword,
    user_tasks,
    user_jobs,
    job_tasks,
    chat,
    jobs,
    employees,
    live
});

export default rootReducer;