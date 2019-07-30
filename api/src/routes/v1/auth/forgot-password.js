
import {
    Router
} from "express";
import {
    respond,
    error,
    convertError,
    sendEmail
} from "../../../helpers/utils";

import { promisify } from "util";
import crypto from "crypto";
import  User from "../../../models/user";

const randomBytesAsync = promisify(crypto.randomBytes);

let sendResetLink = () => {
    return (_req, _res, _next) => {

        let title = 'Reset your password on Web App Boilerplate';
        let message = `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
                        Please click on the following link, or paste this into your browser to complete the process:\n\n
                        ${process.env.APP_URL}/reset-password?token=${_req.cData.token}\n\n
                        If you did not request this, please ignore this email and your password will remain unchanged.\n`;

        return sendEmail(null, _req.cData.user.email, title, message)
            .then(() => {
                _req.responseData = {
                    success: true,
                    message:  `An email has been sent to ${_req.cData.user.email} with further instructions.`
                }
                _next();
            })

    }
};

let validate = () => {
    return (_req, _res, _next) => {
        _req.assert('email', 'Please enter a valid email address.').isEmail();
        _req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

        const errors = _req.validationErrors();

        if (errors) {
            return _next(convertError(errors));
        }

        return User.findOne({email: _req.body.email})
            .then(_user => {
                if(!_user) {
                    return _next(new Error('Account with that email address does not exist'));
                } else {
                    return randomBytesAsync(64)
                        .then(_buf => {
                            let _token = _buf.toString('hex');
                            _user.passwordResetToken = _token;
                            _user.passwordResetExpires = Date.now() + 3600000; // 1 hour
                            _user.save();
                            _req.cData = {
                                user: _user,
                                token: _token
                            };
                            _next();
                        })
                }
            })
    }
}

export default () => {

    let router = Router();

    router.post('/',
        validate(),
        sendResetLink(),
        respond(),
        error()
    );

    return router;

}