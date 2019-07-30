import {
    Router
} from "express"
import {
    respond,
    error,
    toObjectId
} from "../../../helpers/utils"
import  User from "../../../models/user"
import  Job from "../../../models/job"
import  JobInvitation from "../../../models/job-invitation"

let validate = () => {
    return (_req, _res, _next) => {
        return JobInvitation.findOne({hash: _req.params.hash, status: 'pending'})
            .then(_invitation => {
                if(_invitation) {
                    _req.cData = {
                        invitation: _invitation
                    }
                    _next()
                } else {
                    _next(new Error('Invalid job invitation'))
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
                { _id: toObjectId(_req.cData.invitation.job) },
                { $push: { freelancers: { user: _req.cData.invitation.email, role: 'member' } } }
            )
            .then(()=> {
                return JobInvitation.updateOne(
                    { _id: toObjectId(_req.cData.invitation._id) },
                    { $set: { status: 'accepted' } }
                )
            })
            .then(() => {
                return User.findOne({email: _req.cData.invitation.email})
            })
            .then(_user => {
                _req.responseData = {
                    jobId: _req.cData.invitation.job,
                    isRegistered: (_user) ? true : false
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

    router.get('/:hash',
        validate(),
        update(),
        respond(),
        error()
    )

    return router

}