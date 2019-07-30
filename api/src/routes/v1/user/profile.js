import {
    Router
} from "express";
import {
    respond,
    error,
    isAuthenticated
} from "../../../helpers/utils";
import User from "../../../models/user";


let profile = () => {

    return (_req, _res, _next) => {
        User.findById(_req.user._id, {
            email: 1,
            profile: 1
        }, (_err, _user) => {
            if (_err) {
                return _next(_err);
            } else {
                _req.responseData = _user;
                _next();
            }
        })

    }

}


export default () => {

    let router = Router();

    router.get('/',
        isAuthenticated,
        profile(),
        respond(),
        error()
    );

    return router;

}