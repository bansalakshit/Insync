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
import {
    getEmployeesID
} from "../../../helpers/log"
import User from "../../../models/user"

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
        return saveFile(_req.body.image)
            .then(_image => {
                _req.cData = { url: _image }
                return User.updateOne(
                    { '_id': toObjectId(_req.body.userId) },
                    {
                        $set: {
                            'profile.img': _image
                        }
                    }
                )
            })
            .then(_info => {
                _req.responseData = {
                    success: true,
                    url: _req.cData.url,
                    message: 'Profile image saved'
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
        _req.assert('userId', 'User Id cannot be blank').notEmpty()
        _req.assert('image', 'Image cannot be blank').notEmpty()

        const errors = _req.validationErrors()
        
        if (errors) {
            return _next(convertError(errors))
        }

        return getEmployeesID(_req.user._id)
            .then( _employees => {
                _employees = _employees.map(_employee=>_employee.toString())
                if(_employees && _employees.length > 0 && _employees.includes(_req.body.userId)) {
                    _next()
                } else {    
                    return _next(new Error('Unauthorizeds'))
                }
            })
            .catch(_err => {
                return _next(_err)
            })
    }
}

export default () => {

    let router = Router()

    router.post('/update',
        isAuthenticated,
        validateUser(),
        update(),
        respond(),
        error()
    )

    return router

}