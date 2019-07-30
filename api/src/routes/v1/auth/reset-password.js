import {
    Router
} from "express";
import {
    respond,
    error,
    convertError,
    sendEmail
} from "../../../helpers/utils";
import  User from "../../../models/user";

let validateAndReset = () => {
    return (_req, _res, _next) => {

        _req.assert('password', 'Password must be at least 4 characters long.').len(4);
        _req.assert('confirmPassword', 'Passwords must match.').equals(_req.body.password);

        const errors = _req.validationErrors();

        if (errors) {
            return _next(convertError(errors));
        }

        return User
            .findOne({ passwordResetToken: _req.params.token })
            .where('passwordResetExpires').gt(Date.now())
            .exec((_err, _user) => {
                if (_err) { return _next(_err); }
                if (!_user) {
                    return _next(new Error('Password reset token is invalid or has expired.'));
                } else {
                    _user.password = _req.body.password;
                    _user.passwordResetToken = undefined;
                    _user.passwordResetExpires = undefined;
                    return _user.save()
                        .then(() => {
                            _req.logIn(_user, (err) => {
                                if (err) { return _next(err); }
                                _req.cData = {
                                    user: _user
                                }
                                _next();
                            });
                        });
                }
            })

    }
};

let sendConfirmationEmail = () => {

    return (_req, _res, _next) => {
        
        let title = `Your ${process.env.APP_NAME} password has been changed`;
        let message = `Hello,\n\nThis is a confirmation that the password for your account ${_req.cData.user.email} has just been changed.\n`;

        return sendEmail(null, _req.cData.user.email, title, message)
            .then(() => {
                _req.responseData = {
                    success: true,
                    message: 'Success! Your password has been changed.'
                };
                _next();
            })

    }

}

export default () => {

    let router = Router();

    router.post('/:token',
        validateAndReset(),
        sendConfirmationEmail(),
        respond(),
        error()
    );

    return router;

}