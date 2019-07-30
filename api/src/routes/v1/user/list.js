import {
    Router
} from "express";
import {
    respond,
    error,
    isAuthenticated,
} from "../../../helpers/utils";
import  User from "../../../models/user";

let get = () => {
    return (_req, _res, _next) => {

        return User.find()
            .select('profile username')
            .sort({_id: 1})
            .then(_result => {
                _req.responseData = _result;
                _next();
            })
            .catch(_err => {
                return _next(_err);
            })
    }
};

export default () => {

    let router = Router();

    router.get('/',
        isAuthenticated,
        get(),
        respond(),
        error()
    );

    return router;

}