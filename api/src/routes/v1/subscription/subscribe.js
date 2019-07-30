import { Router } from "express"
import axios from 'axios'

import { respond, error, convertError } from "../../../helpers/utils"
import prelaunch from '../../../config/prelaunch'

const validate = () => {
    return (_req, _res, _next) => {
        _req.assert('email', 'Email cannot be blank').notEmpty();
        // _req.sanitize('email').normalizeEmail({
        //     gmail_remove_dots: false
        // });
        
        const errors = _req.validationErrors();
        
        if (errors) {
            return _next(convertError(errors));
        }

        _next()
    }
}

const submit = () => {
    return (_req, _res, _next) => {
        let headers = {
            'Authorization': `Api-Key ${prelaunch.apiKey}`,
            'Content-Type': 'application/json'
        }
        return axios.post(
            `${prelaunch.apiURL}/api/waitlist/join`, _req.body, {
                headers: headers,
            })
            .then(_response => {
                _req.responseData = _response.data
                _next()
            })
            .catch(_err => {
                const msg = _err.response.data && _err.response.data.message ? _err.response.data.message : _err.response.data
                return _next(new Error(msg))
            })
    }
}

export default () => {

    let router = Router()

    router.post('/',
        validate(),
        submit(),
        respond(),
        error()
    )

    return router

}
