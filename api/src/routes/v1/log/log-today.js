import { Router } from "express"
import {
    respond,
    error,
    isAuthenticated,
    toObjectId
} from "../../../helpers/utils"
import {
    logToday
} from "../../../helpers/log"

let get = () => {
    return (_req, _res, _next) => {
        return logToday(_req.user._id, [toObjectId(_req.params.jobId)])
            .then(_seconds => {
                _req.responseData = {
                    data: _seconds,
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

    router.get('/user/:jobId',
        isAuthenticated,
        get(),
        respond(),
        error()
    );

    return router;

}