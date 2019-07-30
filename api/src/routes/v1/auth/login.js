import {
    Router
} from "express"
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import {
    respond,
    error,
    convertError
} from "../../../helpers/utils"
import passport from "passport"
import Token from "../../../models/token";

dotenv.config()

const emitter = require('emitter-io')
const client = emitter.connect()

let validate = () => {
    return (_req, _res, _next) => {
        _req.assert('email', 'Email/Username cannot be blank').notEmpty()
        _req.assert('password', 'Password cannot be blank').notEmpty()
        
        if(!['web','app'].includes(_req.headers.src))
            return _next(new Error("Invalid source"))
        
        const errors = _req.validationErrors()

        if (errors) {
            return _next(convertError(errors))
        }
        _next()
    }
}


let login = () => {
    return (_req, _res, _next) => {
        passport.authenticate('local', (err, user, info) => {
            if (err) {
                return _next(new Error(err))
            }
            if (!user) {
                return _next(new Error(info.msg))
            }
            _req.logIn(user, { session: false }, (err) => {
                if (err) {
                    return _next(err)
                }
                user.last_login = Date.now()

                client.keygen({
                    key: process.env.EMITTER_API_KEY,
                    channel: `InSync/${user._id}/#/`,
                    type: "rw",
                    ttl: 0
                })

                user.save(_err => {
                    if(_err)
                        return _next(_err)

                    const body = { _id : user._id, email : user.email, src: _req.headers.src }
                    const token = jwt.sign({ user : body },process.env.SESSION_SECRET)

                   return Token.updateOne(
                            {
                                user: user._id,
                                src: _req.headers.src
                            },
                            {
                                $set: {
                                    hash: token,
                                    user: user._id,
                                    src: _req.headers.src
                                }
                            },
                            {
                                upsert:true
                            }
                        )
                        .then(() => {
                            _req.responseData = {
                                message: "Login successful",
                                success: true,
                                token: token,
                                user: {
                                    profile: user.profile,
                                    email: user.email,
                                    username: user.username,
                                    active: user.active,
                                    roles: user.roles,
                                    _id: user._id
                                },
                                authenticated: true
                            }
                            _next()
                        })
                        .catch(_err => {return _next(_err)})
                })

                // client.on('keygen', _channel => {
                //     if(_channel.channel.includes(user._id)) {
                //         user.profile.channel_key = _channel.key
                //         user.save(_err => {
                //             if(_err)
                //                 return _next(_err)
        
                //             const body = { _id : user._id, email : user.email, src: _req.headers.src }
                //             const token = jwt.sign({ user : body },process.env.SESSION_SECRET)
        
                //            return Token.updateOne(
                //                     {
                //                         user: user._id,
                //                         src: _req.headers.src
                //                     },
                //                     {
                //                         $set: {
                //                             hash: token,
                //                             user: user._id,
                //                             src: _req.headers.src
                //                         }
                //                     },
                //                     {
                //                         upsert:true
                //                     }
                //                 )
                //                 .then(() => {
                //                     _req.responseData = {
                //                         message: "Login successful",
                //                         success: true,
                //                         token: token,
                //                         user: {
                //                             profile: user.profile,
                //                             email: user.email,
                //                             username: user.username,
                //                             active: user.active,
                //                             roles: user.roles,
                //                             _id: user._id
                //                         },
                //                         authenticated: true
                //                     }
                //                     _next()
                //                 })
                //                 .catch(_err => {return _next(_err)})
                //         })
                //     }
                // })

            })
        })(_req, _res, _next)
    }
}

export default () => {

    let router = Router()

    router.post('/',
        validate(),
        login(),
        respond(),
        error()
    )

    return router

}