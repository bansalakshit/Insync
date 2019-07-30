import { Router } from "express"
import {
    respond,
    error,
    isAuthenticated,
    toObjectId
} from "../../../helpers/utils"
import {
    tasksLogToday,
    logToday
} from "../../../helpers/log"
import  Task from "../../../models/task"

let get = () => {
    return (_req, _res, _next) => {
        _req.cData = {}
        return Task.find({
                job: toObjectId(_req.params.jobId),
                freelancers: {$elemMatch: {user: toObjectId(_req.user._id), status: 'on-going'}}
            })
            .select('description priority link')
            .sort({priority: -1})
            .then(_tasks => {
                _req.cData.dbTasks = _tasks
                return tasksLogToday(_req.user._id, _req.params.jobId)
            })
            .then(_tasks => {
                let tasksList = []

                _req.cData.dbTasks.forEach(_task => {
                    let task = _tasks.find(_t => _t._id.task === _task.description)
                    tasksList.push({
                        _id: _task._id,
                        description: _task.description,
                        priority: _task.priority,
                        link: _task.link,
                        totalSeconds: (task) ? task.totalSeconds : 0
                    })
                    if(task)
                        _tasks = _tasks.filter(_t => _t._id.task !== _task.description)
                })

                // _tasks.forEach(_task => {
                //     tasksList.push({
                //         description: _task._id.task,
                //         priority: 0,
                //         totalSeconds: _task.totalSeconds
                //     })
                // })

                _req.responseData = {
                    data: tasksList,
                    success: true
                }
                _next()
            })
            .catch(_err => {
                _next(_err)
            })

    }
}

export default () => {

    let router = Router();

    router.get('/:jobId',
        isAuthenticated,
        get(),
        respond(),
        error()
    );

    return router;

}