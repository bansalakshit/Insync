import { Router } from "express";
import { respond, error, isAuthenticated, toObjectId } from "../../../helpers/utils";
import { isRoomMember, countUnseen } from "../../../helpers/chat";

let get = () => {
    return (_req, _res, _next) => {
        return isRoomMember(_req.params.roomId, _req.user._id)
            .then(_result => {
                if (_result) {
                    return countUnseen(_req.params.roomId, _req.user._id);
                } else {
                    _next(new Error("Unauthorized"));
                }
            })
            .then(_result => {
                _req.responseData = _result;
                _next();
            })
            .catch(_err => {
                return _next(_err);
            });
    };
};

export default () => {
    let router = Router();

    router.get("/:roomId/count", isAuthenticated, get(), respond(), error());

    return router;
};
