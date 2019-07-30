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
    getFreelancerJobIds, getUserJobIds
} from "../../../helpers/job"

const getJobIds = async(_freelancerId, _employeerId, _jobId) => {
    let jobIds = [toObjectId(_jobId)];
    if(_employeerId === 'all' && _jobId === 'all')
        jobIds = await getFreelancerJobIds(_freelancerId)
    
    if(_employeerId !== 'all' && _jobId === 'all')
        jobIds = await getUserJobIds(_employeerId)

    return jobIds;
}

const getLogs =  () => {
    return (_req, _res, _next) => {
        return getJobIds(_req.user._id, _req.body.employeer, _req.body.job)
            .then(_jobIds => {
                return logCustomDate(_req.user._id, _req.body.start, _req.body.end, _jobIds)
            })
            .then(_logs => {
                _req.responseData = _logs
                _next()
            })
    }
}

export default () => {

    let router = Router()

    router.post('/',
        isAuthenticated,
        getLogs(),
        respond(),
        error()
    )

    return router

}