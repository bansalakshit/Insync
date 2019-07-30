import {
    Router
} from "express"
import {
    respond,
    error,
    isAuthenticated,
    toObjectId
} from "../../../helpers/utils"
import Job from '../../../models/job'
import User from '../../../models/user'

let getUserJobs = () => {
    return (_req, _res, _next) => {
        return User.findOne({_id: toObjectId(_req.params.userId)})
            .then(_user => {
                if(!_user)
                    return _next(new Error('Invalid userId'))
                else 
                    return Job.find({
                        $and: [
                            { owner: toObjectId(_req.user._id) },
                            { freelancers: { $elemMatch: { user: _user.email } } }
                        ]
                    })
            })
            .then(_jobs => {
                _req.responseData = _jobs
                _next()
            })
            .catch(_err => { _next(_err) })
    }
}

export default () => {

    let router = Router()

    router.get('/:userId',
        isAuthenticated,
        getUserJobs(),
        respond(),
        error()
    )

    return router

}