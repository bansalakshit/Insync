import {
    Router
} from "express";
import {
    respond,
    error,
} from "../../../helpers/utils";
import passport from "passport";


let login = () => {
    return (_req, _res, _next) => {

        if (!_req.user) {
            return _next(new Error('User Not Authenticated'));
        }

        let user = _req.user;
        _req.logIn(user, (err) => {
            if (err) {
                return _next(err);
            }
            user.save(_err => {
                _req.responseData = {
                    message: "Login successful",
                    success: true,
                    user: {
                        profile: _req.user.profile,
                        email: _req.user.email,
                        active: _req.user.active,
                        roles: _req.user.roles,
                        _id: _req.user._id
                    },
                    authenticated: true
                };
                _next();
            })
        });

    }
}

export default () => {

    let router = Router();

    router.post('/',
        passport.authenticate('google-token', {
            session: false
        }),
        login(),
        respond(),
        error()
    );

    return router;

}