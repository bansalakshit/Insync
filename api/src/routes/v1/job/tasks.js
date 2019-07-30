import {
    Router
} from "express"
import {
    respond,
    error,
    convertError,
    isAuthenticated,
    toObjectId
} from "../../../helpers/utils"
import {
    isJobOwner
} from "../../../helpers/job"
import { newTask, removeTask, doneTask } from "../../../helpers/websocket"
import Task from "../../../models/task"
import Job from "../../../models/job"

let get = () => {
    return (_req, _res, _next) => {
        _req.responseData = {}
        return Job.findOne({
                _id: toObjectId(_req.params.jobId)
            })
            .then(_job => {
                if(!_job)
                    return _next(new Error('Invalid job ID'))

                _req.responseData.job = _job
                return Task.find({
                    job: toObjectId(_req.params.jobId)
                })
                .populate('freelancers.user', 'profile')
            })
            .then(_tasks => {
                _req.responseData.tasks = _tasks
                _next()
            })
            .catch(_err => {
                return _next(_err)
            })
    }
}

let validate = () => {
    return (_req, _res, _next) => {
        _req.assert('task', 'Task description cannot be blank').notEmpty()
        _req.assert('priority', 'Task priority cannot be blank').notEmpty()
        
        const errors = _req.validationErrors()
        
        if (errors) {
            return _next(convertError(errors))
        }

        _next()
        // return isJobOwner(_req.user._id, _req.params.jobId)
        //     .then(_isOwner => {
        //         if(!_isOwner)
        //             return _next(new Error('Invalid Job ID'))
        //         else
        //             _next()
        //     })
        //     .catch(_err => {
        //         return _next(_err)
        //     })
    }
}

let create = () => {
    return (_req, _res, _next) => {

        let users = []
        if(_req.body.users && _req.body.users.length > 0) {
            _req.body.users.forEach(_user => {
                users.push({
                    user: _user
                })
            })
        }
        
        return Task.create({
                description: _req.body.task,
                link: _req.body.link,
                priority: _req.body.priority,
                freelancers: users,
                job: _req.params.jobId,
                tags: _req.body.tags ? _req.body.tags : []
            })
            .then(_task => {
                let message = 'Task was created successfully'
                if(_req.body.users && _req.body.users.length > 0) {
                    message = 'Task was created and employees was assigned successfully'

                    _req.body.users.forEach(_userId => {
                        newTask(_userId, _task)
                    })
                }
                
                _req.responseData = {
                    success: true,
                    message: message
                }
                _next()
            })
            .catch(_err => {
                return _next(_err)
            })
    }
}

let validateAssign = () => {
    return (_req, _res, _next) => {
        _req.assert('users', 'Users cannot be blank').notEmpty()
        
        const errors = _req.validationErrors()
        
        if (errors) {
            return _next(convertError(errors))
        }

        if(_req.body.users.length <= 0)
            return _next(new Error('Users cannot be blank'))

        return Job.findOne({
                $or: [
                    { owner: toObjectId(_req.user._id) },
                    { managers: { $elemMatch: { user: toObjectId(_req.user._id) } } }
                ],  
                _id: toObjectId(_req.params.jobId),
            })
            .then(_job => {
                if(_job) {
                    return Task.findOne({
                        job: toObjectId(_req.params.jobId),
                        _id: toObjectId(_req.params.taskId),
                    })
                } else {
                    _next(new Error('Unauthorized.'))
                }
            })
            .then(_task => {
                if(!_task) {
                    _next(new Error('Invalid task ID.'))
                } else {
                    _next()
                }
            })  
            .catch(_err => {
                return _next(_err)
            })
    }
}

let doAssign = async (_jobId, _taskId, _userId) => {
    let task = await Task.findOne({
                job: toObjectId(_jobId),
                _id: toObjectId(_taskId),
                freelancers: {$elemMatch: {user: toObjectId(_userId)}}
            })
    if(!task) {
        await Task.updateOne({
            $and: [
                { _id: toObjectId(_taskId) },
                { job: toObjectId(_jobId) }
            ]
            }, { $push: { freelancers: { user: _userId } } }
        )  

        let taskInfo = await Task.findOne({
                job: toObjectId(_jobId),
                _id: toObjectId(_taskId)
            })
        newTask(_userId, taskInfo)
    }

}

let assign = () => {
    return (_req, _res, _next) => {

        let promises = []

        _req.body.users.forEach(_user => {
            promises.push(doAssign(_req.params.jobId, _req.params.taskId, _user))
        })

        return Promise.all(promises)  
            .then(() => {
                _req.responseData = {
                    message: 'Successfully assigned employee(s) to task',
                    success: true
                }
                _next()
            })
            .catch(_err=>{_next(_err)})
    }
}

let remove = () => {
    return (_req, _res, _next) => {
        return Task.updateOne( {
                    $and: [
                            { _id: toObjectId(_req.params.taskId) },
                            { job: toObjectId(_req.params.jobId) }
                        ]
                },
                { $pull: { freelancers: { user: _req.params.userId } } }
            )     
            .then(() => {
                removeTask(_req.params.userId, {_id: _req.params.taskId})
                _req.responseData = {
                    message: 'Successfully removed employee to task',
                    success: true
                }
                _next()
            })
            .catch(_err=>{_next(_err)})
    }
}

let validateUpdate = () => {
    return (_req, _res, _next) => {
        _req.assert('field', 'Field cannot be blank').notEmpty()
        _req.assert('value', 'Value cannot be blank').notEmpty()
        
        const errors = _req.validationErrors()
        
        if (errors) {
            return _next(convertError(errors))
        }

        return Task.findOne({
                _id: toObjectId(_req.params.taskId)
            })
            .populate('job')
            .then(_task => {
                if(_task) {
                    if(_task.job.owner.toString() === _req.user._id.toString() || _task.job.managers.map(m=>m.user.toString()).includes(_req.user._id.toString()) ) {
                        _next()
                    } else {
                        _next(new Error('Unauthorized.'))
                    }
                } else {
                    _next(new Error('Invalid task ID.'))
                }
            })
            .catch(_err => {
                return _next(_err)
            })
    }
}

let update = () => {
    return (_req, _res, _next) => {
        return Task.updateOne({
                _id: toObjectId(_req.params.taskId)
            }, {
                $set: { [_req.body.field]: _req.body.value }
            })
            .then(() => {
                _req.responseData = {
                    message: 'Successfully updated task',
                    success: true
                }
                _next()
            })
    }
}

let done = () => {
    return (_req, _res, _next) => {
        return Task.updateOne({
                _id: toObjectId(_req.params.taskId),
                freelancers: {$elemMatch: {user: toObjectId(_req.user._id)}}
            }, {
                $set: { "freelancers.$.status": "completed" }
            })
            .then(() => {
                doneTask(_req.user._id, _req.params.taskId)
                _req.responseData = {
                    message: 'Successfully marked task as completed',
                    success: true
                }
                _next()
            })
    }
}

export default () => {

    let router = Router()

    router.post('/update/:taskId',
        isAuthenticated,
        validateUpdate(),
        update(),
        respond(),
        error()
    )

    router.get('/done/:taskId',
        isAuthenticated,
        done(),
        respond(),
        error()
    )

    router.get('/remove/:jobId/:taskId/:userId',
        isAuthenticated,
        remove(),
        respond(),
        error()
    )

    router.post('/assign/:jobId/:taskId',
        isAuthenticated,
        validateAssign(),
        assign(),
        respond(),
        error()
    )

    router.get('/list/:jobId',
        isAuthenticated,
        get(),
        respond(),
        error()
    )

    router.post('/create/:jobId',
        isAuthenticated,
        validate(),
        create(),
        respond(),
        error()
    )

    return router

}