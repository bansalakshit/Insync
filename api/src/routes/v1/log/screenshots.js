import {
    Router
} from "express"
import {
    respond,
    error,
    isAuthenticated,
    toObjectId
} from "../../../helpers/utils"
import {
    logCustomDate
} from "../../../helpers/log"
import {
    getUserJobIds
} from "../../../helpers/job"
import  User from "../../../models/user"


let get = () => {
    return (_req, _res, _next) => {
        return User.findOne({_id: toObjectId(_req.params.freelancerId)})
            .select('profile')
            .then(_user => {
                if(!_user) {
                    _next(new Error('Invalid freelancer ID'))
                } else {
                    _req.responseData = { freelancer: _user }
                    _next()
                }
            })
    }
}

let getLogs =  () => {
    return (_req, _res, _next) => {
        return getUserJobIds(_req.user._id)
            .then(_jobIds => {
                return logCustomDate(_req.params.freelancerId, _req.body.start, _req.body.end, _jobIds)
            })
            .then(_logs => {
                _req.responseData.logs = _logs
                _next()
            })
    }
}

export default () => {

    let router = Router()

    router.post('/:freelancerId',
        isAuthenticated,
        get(),
        getLogs(),
        respond(),
        error()
    )

    return router

}