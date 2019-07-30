import {
    Router
} from "express"
import * as EmailValidator from 'email-validator'
import { promisify } from "util"
import crypto from "crypto"
import {
    respond,
    error,
    convertError,
    isAuthenticated,
    toObjectId,
    sendEmail
} from "../../../helpers/utils"
import Job from "../../../models/job"
import JobInvitation from "../../../models/job-invitation"
const randomBytesAsync = promisify(crypto.randomBytes)


let doInvite = async (_email, _job, _user) => {

    try {
        if(EmailValidator.validate(_email)) {
            let hash = (await randomBytesAsync(64)).toString('hex');
            let title = `Job Invitation at ${process.env.APP_NAME}`;
            let message = `
                            You were invited by ${_user.profile.first_name} ${_user.profile.last_name} to a job with details below: \n\n
                            
                            Job\n
                            \tTitle: ${_job.title} \n
                            \tDescription: ${_job.description} \n
                            
                            Please click on the following link, or paste this into your browser to accept the invitation:\n\n
                                ${process.env.BASE_URL}/jobs/invitation?token=${hash}\n\n
                        `;


            await sendEmail(null, _email, title, message);
            await JobInvitation.create({
                email: _email,
                job: _job._id,
                hash: hash
            })
        }
        return { error: false, message: '' }
    } catch(_err) {
        return { error: true, message: _err }
    }

}

let invite = () => {
    return (_req, _res, _next) => {
        return doInvite(_req.body.user, _req.cData.job, _req.user)
            .then((_result)=> {
                if(!_result.error) {
                    _req.responseData = {
                        success: true,
                        message: "Invitation was sent successfully."
                    }
                    _next()
                } else {
                    _next(new Error(_result.message))
                }
            })
            .catch(_err => {
                _next(_err)
            })
    }
}


let validate = () => {
    return (_req, _res, _next) => {
        _req.assert('user', 'Freelancer Email cannot be blank').notEmpty()
        // _req.assert('rate', 'Rate cannot be blank').notEmpty()
        
        const errors = _req.validationErrors()
        
        if (errors) {
            return _next(convertError(errors))
        }

        return Job.findOne({ _id: toObjectId(_req.params.jobId), owner:  toObjectId(_req.user._id)})
            .then(_job => {
                if(!_job) {
                    return _next(new Error('Invalid Job ID'))
                } else {
                    _req.cData = {
                        job: _job
                    }
                    return Job.findOne({_id: toObjectId(_req.params.jobId), freelancers: {$elemMatch: {user: _req.body.user}}})
                }
            })
            .then(_job => {
                if(_job) {
                    return _next(new Error('Freelancer was already assigned to this job'))
                } else {
                    _next()
                }
            })
            .catch(_err => {
                return _next(_err)
            })
    }
}

export default () => {

    let router = Router()

    router.post('/:jobId',
        isAuthenticated,
        validate(),
        invite(),
        respond(),
        error()
    )

    return router

}