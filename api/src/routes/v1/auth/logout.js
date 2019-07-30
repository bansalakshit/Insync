import {
    Router
} from "express"
import passport from 'passport'
import {
    respond,
    error,
    toObjectId
} from "../../../helpers/utils"
import Token from "../../../models/token"

let logout = () => {
    return (_req, _res, _next) => {
        return Token.deleteMany({
                user: toObjectId(_req.user._id),
                src: _req.headers.src
            })
            .then(() => {
                _req.logout()
                _req.responseData = {
                    success: true,
                    message: 'Logout successfully'
                }
                _next()
            })
    }
}

export default () => {

    let router = Router()

    router.get('/',
        passport.authenticate('jwt', { session : false }),
        logout(),
        respond(),
        error()
    )

    return router

}