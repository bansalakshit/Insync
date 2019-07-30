import {
    Router
} from "express"
import {
    respond,
    error,
    isAuthenticated
} from "../../../helpers/utils"
import {
    employeeTaskLogTime
} from "../../../helpers/log"
import Task from '../../../models/task'

let getUserTasks = () => {
    return (_req, _res, _next) => {
        return Task.find({
                freelancers: { $elemMatch: { user: _req.params.userId, status: 'on-going' } }
            })
            .populate('job', 'title description')
            .then(_tasks => {
                let promises = []
                _tasks.forEach(_task => {
                    promises.push(employeeTaskLogTime(_req.params.userId, _task))
                })
                return Promise.all(promises)
            })
            .then(_tasks => {
                _req.responseData = _tasks
                _next()
            })
            .catch(_err => { _next(_err) })
    }
}

export default () => {

    let router = Router()

    router.get('/:userId',
        isAuthenticated,
        getUserTasks(),
        respond(),
        error()
    )

    return router

}