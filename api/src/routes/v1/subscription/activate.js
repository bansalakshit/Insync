import { Router } from "express"
import axios from 'axios'

import { respond, error } from "../../../helpers/utils"
import prelaunch from '../../../config/prelaunch'


const submit = () => {
    return (_req, _res, _next) => {
        let headers = {
            'Authorization': `Api-Key ${prelaunch.apiKey}`,
            'Content-Type': 'application/json'
        }

        return axios.get(
            `${prelaunch.apiURL}/api/waitlist/activate/${_req.params.hash}`, {
                headers: headers,
            })
            .then(_response => {
                if(_response.data.success) {
                    _req.responseData = _response.data
                    _next()
                } else {
                    return _next(new Error(_response.data.message))
                }
            })
            .catch(_err => {
                const msg = _err.response.data && _err.response.data.message ? _err.response.data.message : _err.response.data
                return _next(new Error(msg))
            })
    }
}

export default () => {

    let router = Router()

    router.get('/:hash',
        submit(),
        respond(),
        error()
    )

    return router

}
