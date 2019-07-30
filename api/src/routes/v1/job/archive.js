import {
    Router
} from "express"
import {
    respond,
    error,
    convertError,
    isAuthenticated,
    toObjectId,
} from "../../../helpers/utils"
import Job from "../../../models/job"
import User from "../../../models/user"
import Task from "../../../models/task"

let validateUser = () => {
    return (_req, _res, _next) => {
        return User.findOne({ _id: toObjectId(_req.params.userId)})
            .then(_user => {
                if(!_user) {
                    return _next(new Error('Invalid User ID'))
                } else {
                    _req.cData = {
                        user: _user
                    }
                    _next()
                }
            })
            .catch(_err => {
                return _next(_err)
            })
    }
}

let archive = () => {
    return (_req, _res, _next) => {
        
        return Job.findOne({ _id: toObjectId(_req.params.jobId), owner:  toObjectId(_req.user._id)})
            .then(_job => {
                if(!_job) {
                    return _next(new Error('Invalid Job ID'))
                } else {
                    return Job.updateOne({
                            $and: [
                                { _id: toObjectId(_req.params.jobId) },
                                { owner:  toObjectId(_req.user._id) },
                                { "freelancers.user": _req.cData.user.email}
                            ]
                        }, {
                            $pull: { freelancers: { user: _req.cData.user.email } }
                        })
                }
            })
            .then(() => {
                return Task.updateMany({
                        job:  toObjectId(_req.params.jobId)
                    },
                    { $pull: { freelancers: { user: _req.params.userId } } }
                ) 
            })
            .then(() => {
                _req.responseData = {
                    success: true,
                    message: "Employee was removed from job."
                }
                _next()
            })
            .catch(_err => {
                return _next(_err)
            })
    }
}

export default () => {

    let router = Router()

    router.get('/:jobId/:userId',
        isAuthenticated,
        validateUser(),
        archive(),
        respond(),
        error()
    )

    return router

}