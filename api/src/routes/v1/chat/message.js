import { Router } from "express";
import { respond, error, isAuthenticated, convertError, toObjectId } from "../../../helpers/utils";
import Room from "../../../models/room";
import { sendMessage } from "../../../helpers/chat";

let validate = () => {
    return (_req, _res, _next) => {
        _req.assert("message", "Message cannot be blank").notEmpty();
        _req.assert("users", "User cannot be blank").notEmpty();

        const errors = _req.validationErrors();

        if (errors) {
            return _next(convertError(errors));
        }
        return Room.findOne({
            _id: _req.body.room,
            members: { $elemMatch: { user: toObjectId(_req.user._id) } }
        })
            .then(_room => {
                if (_room) _next();
                else return _next(new Error("Unauthorized"));
            })
            .catch(_err => _next(_err));
    };
};

let create = () => {
    return (_req, _res, _next) => {
        return sendMessage(_req.user._id, _req.body.room, null, _req.body.message)
            .then(_result => {
                _req.responseData = _result;
                _next();
            })
            .catch(_err => _next(_err));
    };
};

export default () => {
    let router = Router();

    router.post("/new", isAuthenticated, validate(), create(), respond(), error());

    return router;
};
