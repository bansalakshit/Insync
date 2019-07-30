import {
    Router
} from "express";
import {
    respond,
    error,
    convertError,
    isAuthenticated
} from "../../../helpers/utils";
import User from "../../../models/user";

let update = () => {

    return (_req, _res, _next) => {

        if(_req.body.type == 'profile') {
            _req.assert('first_name', 'First Name cannot be blank').notEmpty();
            _req.assert('last_name', 'Last Value cannot be blank').notEmpty();

            _req.assert('email', 'Email is not valid').isEmail();
            _req.sanitize('email').normalizeEmail({
                    gmail_remove_dots: false
            });
        } else {
            _req.assert('password', 'Password must be at least 4 characters long').len(4);
            _req.assert('confirmPassword', 'Passwords do not match').equals(_req.body.password);
        }

        const errors = _req.validationErrors();

        if (errors) {
            return _next(convertError(errors));
        }

        return User.findById(_req.user.id)
            .then(_user => {

                if(_req.body.type == 'profile') {
                    _user.profile.first_name = _req.body.first_name;
                    _user.profile.last_name = _req.body.last_name;
                    _user.email = _req.body.email;
                } else {
                    _user.password = _req.body.password;
                }
                return _user.save();
                    
            })
            .then(() => {
                _req.responseData = {
                    success: true,
                    message: "Profile was updated successfully."
                };
                _next();
            })
            .catch(_err => {
                if (_err.code === 11000) {
                    return _next(new Error('The email address you have entered is already associated with an account.'));
                } else {
                    return _next(_err);
                }
            })

    }

}

export default () => {

    let router = Router();

    router.post('/',
        isAuthenticated,
        update(),
        respond(),
        error()
    );

    return router;

}