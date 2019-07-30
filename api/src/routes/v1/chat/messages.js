import { Router } from "express";
import { respond, error, isAuthenticated, toObjectId } from "../../../helpers/utils";
import { countUnseen } from "../../../helpers/chat";
import Message from "../../../models/message";

let get = () => {
    return (_req, _res, _next) => {
         let param = { room: toObjectId(_req.params.roomId) };
        
        if (_req.params.lastMessageId) {
            param._id = { $lt: _req.params.lastMessageId };
        }

        return (
            Message.find(
                param
            )
                .populate("from", "profile username")
                .populate("to", "profile username")
                .sort({ createdAt: -1 })
                .limit(15)
                .then(_result => {
                    const lastMessageId = _result && _result.length > 0 ? _result[_result.length - 1]._id : _req.params.lastMessageId;
                    _req.responseData = {
                        lastMessageId: lastMessageId,
                        messages: _result.reverse(),
                    };
                    return countUnseen(_req.params.roomId, _req.user._id)
                })
                .then(_count => {
                    _req.responseData.unseen = _count;
                    _next()
                })
                .catch(_err => {
                    return _next(_err);
                })
        );
    };
};

export default () => {
    let router = Router();

    router.get("/:roomId/:lastMessageId?", isAuthenticated, get(), respond(), error());

    return router;
};
