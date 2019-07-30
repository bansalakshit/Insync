import {
    Router
} from "express"
import moment from 'moment'
import {
    respond,
    error,
    isAuthenticated
} from "../../../helpers/utils"
import {
    dayTotalSeconds
} from "../../../helpers/log"
import {
    getUserJobIds
} from "../../../helpers/job"

let getSeconds =  () => {
    return (_req, _res, _next) => {
        return getUserJobIds(_req.user._id)
            .then(_jobIds => {
                let start = moment(_req.body.start)
                let end = moment(_req.body.end)
                let promises = []
                do {
                    promises.push(dayTotalSeconds(_req.params.freelancerId, start, _jobIds))
                    start.add(1, 'day')
                } while(start <= end)

                return Promise.all(promises)
            })
            .then(_results => {
                _req.responseData = _results
                _next()
            })
            .catch(_err => {
                return _next(_err)
            })
    }
}

export default () => {

    let router = Router()

    router.post('/:freelancerId',
        isAuthenticated,
        getSeconds(),
        respond(),
        error()
    )

    return router

}