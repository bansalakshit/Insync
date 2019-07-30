import { Router } from "express"
import moment from "moment"
import {
    respond,
    error,
    convertError,
    isAuthenticated,
    toObjectId
} from "../../../helpers/utils"
import Log from "../../../models/log"
import Job from "../../../models/job"
import Task from "../../../models/task"
import { latestLogTime, latestScreenshots, newLog } from "../../../helpers/websocket"

let stop = () => {
    return (_req, _res, _next) => {
        let end = _req.cData.end
        let start = _req.cData.start
        return Log.create({
                task: _req.body.task,
                taskId: _req.body.taskId,
                job: _req.body.job,
                user: _req.user._id,
                start: start.toDate(),
                end: end.toDate()
            })
            .then(_log => {
                latestLogTime(_req.cData.job.owner, _req.user._id, _req.cData.job._id)
                latestScreenshots(_req.cData.job.owner, _req.user._id, _req.cData.job._id)
                newLog(_req.user._id, _req.cData.job._id)
                _req.responseData = {
                    success: true,
                    message: _log._id
                }
                _next()
            })
            .catch(_err => {
                console.log(_err)
                return _next(_err)
            })
    }
}

let validateUser = () => {
    return (_req, _res, _next) => {
        _req.assert('job', 'Job cannot be blank').notEmpty()
        _req.assert('task', 'Task cannot be blank').notEmpty()
        _req.assert('taskId', 'Task ID cannot be blank').notEmpty()
        _req.assert('seconds', 'seconds cannot be blank').notEmpty()
        
        const errors = _req.validationErrors()
        
        if (errors) {
            return _next(convertError(errors))
        }

        return Job.findOne({_id: toObjectId(_req.body.job)})
            .then( _job => {
                if(_job) {
                    _req.cData = { 
                        end: moment(),
                        start: moment().subtract(_req.body.seconds, 'seconds'),
                        job: _job 
                    }
                    let freelancers = _job.freelancers.map(member=>member.user)
                    if(freelancers.includes(_req.user.email)) {
                        return Task.findOne({
                            job: toObjectId(_req.body.job),
                            _id: toObjectId(_req.body.taskId),
                            freelancers: {$elemMatch: {user: toObjectId(_req.user._id)}}
                        })
                    } else {
                        return _next(new Error('Unauthorized'))
                    }
                } else {    
                    return _next(new Error('Invalid job ID'))
                }
            })
            .then( _task => {
                if(_task) {
                    _next()
                } else {    
                    return _next(new Error('Invalid task ID'))
                }
            })
            .catch(_err => {
                return _next(_err)
            })
    }
}

export default () => {

    let router = Router()

    router.post('/',
        isAuthenticated,
        validateUser(),
        stop(),
        respond(),
        error()
    )

    return router

}