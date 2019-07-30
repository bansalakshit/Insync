import { Router } from "express"
import { promisify } from "util"
import crypto from "crypto"
import AWS from 'aws-sdk'
import {
    respond,
    error,
    convertError,
    isAuthenticated,
    toObjectId
} from "../../../helpers/utils"
import Log from "../../../models/log"
import Job from "../../../models/job"
import { latestScreenshots, latestLogTime } from "../../../helpers/websocket"

const randomBytesAsync = promisify(crypto.randomBytes)

let saveFile = (base64Data) => {
    return new Promise((resolve, reject) => {
        const s3 = new AWS.S3({
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
        })

        randomBytesAsync(64)
            .then(_buf => {
                let filename = `${_buf.toString('hex')}-${new Date().getTime()}.png`
                base64Data = new Buffer(base64Data.replace(/^data:image\/\w+;base64,/, ""), 'base64')
                const params = {
                    Bucket: process.env.S3_BUCKET,
                    Key: filename,
                    Body: base64Data,
                    ContentEncoding: 'base64',
                    ContentType: 'image/png'
                }
                s3.upload(params, (s3Err, data) => {
                    if (s3Err) reject(s3Err)

                    resolve(data.Location)
                })
            })
    })
}

let update = () => {
    return (_req, _res, _next) => {
       
        let promises = []

        _req.body.images.forEach(_image => {
            promises.push(saveFile(_image))
        })
        return Promise.all(promises)
            .then(_images => {
                _req.cData.log.screenshots = _images
                _req.cData.log.save()

                return Job.findById(_req.cData.log.job)
            })
            .then(_job => {
                if(_job) {
                    latestScreenshots(_job.owner, _req.user._id, _job._id)
                    latestLogTime(_job.owner, _req.user._id, _job._id)
                }
                _req.responseData = {
                    success: true,
                    message: 'Screenshots saved'
                }
                _next()
            })
            .catch(_err => {
                console.log(_err)
                return _next(_err)
            })
    }
}

let validateUser = () => {
    return (_req, _res, _next) => {
        _req.assert('id', 'Log Id cannot be blank').notEmpty()
        _req.assert('images', 'Images cannot be blank').notEmpty()

        const errors = _req.validationErrors()
        
        if (errors) {
            return _next(convertError(errors))
        }

        return Log.findOne({
                _id: toObjectId(_req.body.id),
                user: toObjectId(_req.user._id)
            })
            .then( _log => {
                if(_log) {
                    _req.cData = {
                        log: _log
                    }
                    _next()
                } else {    
                    return _next(new Error('Invalid log ID'))
                }
            })
            .catch(_err => {
                return _next(_err)
            })
    }
}

export default () => {

    let router = Router()

    router.post('/screenshots',
        isAuthenticated,
        validateUser(),
        update(),
        respond(),
        error()
    )

    return router

}