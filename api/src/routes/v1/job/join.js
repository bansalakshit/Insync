import {
    Router
} from "express"
import {
    respond,
    error,
    toObjectId,
    isAuthenticated
} from "../../../helpers/utils"
import { newJob } from "../../../helpers/websocket"
import Job from "../../../models/job"
import User from "../../../models/user"

let validate = () => {
    return (_req, _res, _next) => {
        return Job.findOne({_id: toObjectId(_req.params.jobId)})
            .populate('owner', 'profile username')
            .then(_job => {
                if(_job) {
                    _req.cData = { job: _job }
                    return Job.findOne({_id: toObjectId(_req.params.jobId), freelancers: {$elemMatch: {user: _req.user.email}}})
                    _next()
                } else {
                    _next(new Error('Invalid job invitation url.'))
                }
            })
            .then(_job => {
                if(_job) {
                    return _next(new Error('You have already joined this job'))
                } else {
                    _next()
                }
            })  
            .catch(_err => {
                return _next(_err)
            })
    }
}

let update = () => {
    return (_req, _res, _next) => {
        return Job.updateOne(
                { _id: toObjectId(_req.params.jobId) },
                { $push: { freelancers: { user: _req.user.email, role: 'member' } } }
            )
            .then(() => {
                return User.findOne({email: _req.user.email})
            })
            .then(_user => {
                if(_user && _user.profile) {
                    newJob(_user._id, _req.cData.job)
                }
                _req.responseData = {
                    message: 'This job has been added to your account. Please sign in to the InSync desktop app to clock time for this job.',
                    success: true
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

    router.get('/:jobId',
        isAuthenticated,
        validate(),
        update(),
        respond(),
        error()
    )

    return router

}