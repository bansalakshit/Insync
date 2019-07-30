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

import { promisify } from "util";
import crypto from "crypto";

const randomBytesAsync = promisify(crypto.randomBytes);

console.log('hdfdsuifghsu');

let create = () => {
    return (_req, _res, _next) => {

        console.log('Register file');

        _req.assert('first_name', 'First Name cannot be blank').notEmpty();
        _req.assert('last_name', 'Last Name cannot be blank').notEmpty();
        _req.assert('username', 'Username cannot be blank').notEmpty();
        _req.assert('email', 'Email is not valid').isEmail();
        _req.assert('password', 'Password must be at least 4 characters long').len(4);
        _req.assert('confirmPassword', 'Passwords do not match').equals(_req.body.password);
        // _req.sanitize('email').normalizeEmail({
        //     gmail_remove_dots: false
        // });

        const errors = _req.validationErrors();
        
        if (errors) {
            return _next(convertError(errors));
        }

        const user = new User({
            email: _req.body.email,
            username: _req.body.username,
            password: _req.body.password,
            profile: {
                first_name: _req.body.first_name,
                last_name: _req.body.last_name
            },
            roles: ['member']
        });

        User.findOne({
            'profile.username': _req.body.username
        }, (err, existingUser) => {
            if (err) {
                return _next(err);
            }
            if (existingUser) {
                return _next(new Error('Account with that username already exists.'));
            }
            User.findOne({
                email: _req.body.email
            }, (err, existingUser) => {
                if (err) {
                    return _next(err);
                }
                if (existingUser) {
                    return _next(new Error('Account with that email address already exists.'));
                }
                randomBytesAsync(64)
                    .then(_buf => {
                    user.activationToken = _buf.toString('hex');
                    user.save((err) => {
                            if (err) {
                                return _next(err);
                            }

                            _req.cData = {
                                user: user
                            }
                            
                            _next();
                            
                        });
                    })
            })
        })

    }
};


let sendActivationLink = () => {
    return (_req, _res, _next) => {

        let title = `Activate your account on ${process.env.APP_NAME}`;
        let message = `Please click on the following link, or paste this into your browser to complete your account activation:\n\n
                        ${process.env.APP_URL}/activate?token=${_req.cData.user.activationToken}\n\n`;

        return sendEmail(null, _req.cData.user.email, title, message)
            .then(() => {
                 _req.responseData = {
                    message: "Registration successful. Please check your email for the activation link.",
                    success: true
                }
                _next();
            })

    }
};

export default () => {

    let router = Router();

    router.post('/',
        create(),
        sendActivationLink(),
        respond(),
        error()
    );

    return router;

}