import {
    Router
} from "express";
import {
    respond,
    error
} from "../../../helpers/utils";
import  User from "../../../models/user";

let validate = () => {
    return (_req, _res, _next) => {

        return User
            .findOne({ passwordResetToken: _req.params.token })
            .where('passwordResetExpires').gt(Date.now())
            .exec((_err, _user) => {
                if (_err) { return _next(_err); }
                if (!_user) {
                    return _next(new Error('Password reset token is invalid or has expired.'));
                } else {
                    _req.responseData = {
                        success: true,
                        message: "Valid token"
                    };
                    _next();
                }
            })

    }
};

export default () => {

    let router = Router();

    router.get('/:token',
        validate(),
        respond(),
        error()
    );

    return router;

}