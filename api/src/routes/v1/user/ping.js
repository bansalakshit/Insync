import {
    Router
} from "express"
import {
    respond,
    error,
    isAuthenticated,
} from "../../../helpers/utils";
import  User from "../../../models/user";

let ping = () => {
    return (_req, _res, _next) => {

        return User.findById(_req.user._id)
            .then(_user => {
                if(_user) {
                    _user.profile.isOnline = true
                    _user.save()
                    setTimeout(() => {
                        _user.profile.isOnline = false
                        _user.save()
                    }, 1000 * 60 * 5)
                }
                _next()
            })
            .catch(_err => {
                return _next(_err)
            })
    }
};

export default () => {

    let router = Router()

    router.get('/',
        isAuthenticated,
        ping(),
        respond(),
        error()
    );

    return router

}