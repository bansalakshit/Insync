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

        let cond = { activationToken: _req.params.token };

        if (_req.isAuthenticated()) {
            cond = { $and: [
                { activationToken: _req.params.token },
                { _id: _req.user._id }
            ] };
        }

        return User
            .findOne(cond)
            .then((_user) => {
                if (!_user) {
                    return _next(new Error('Activation token is invalid.'));
                } else {
                    _user.active = true;
                    _user.activationToken = undefined;
                    _user.save(err => {
                        if (err) {
                            return _next(err);
                        }
                        _req.responseData = {
                            success: true,
                            message: "Your account has been activated."
                        };
                        _next();

                    });
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