import {
    Router
} from "express"
import {
    respond,
    error,
    isAuthenticated,
    toObjectId
} from "../../../helpers/utils"
import { unseenMessages }  from '../../../helpers/websocket'
import  Message from "../../../models/message"
import { isRoomMember } from "../../../helpers/chat";

let get = () => {
    return (_req, _res, _next) => {
        return isRoomMember(_req.params.roomId, _req.user._id)
            .then(_result => {
                return Message.updateOne({
                    room: toObjectId(_req.params.roomId) , 
                    _id: { $eq: toObjectId(_req.params.messageId) }
                },{
                    $push: {
                        views: _req.user._id.toString()
                    }
                })
            })
            .then(_result => {
                _req.responseData = {
                    message: 'Messages status updated',
                    success: true,
                    data: _result
                }
                unseenMessages(_req.params.roomId, _req.user._id)
                _next()
            })
            .catch(_err => {
                return _next(_err)
            })
    }
}

export default () => {

    let router = Router()

    router.get('/:roomId/:messageId',
        isAuthenticated,
        get(),
        respond(),
        error()
    )

    return router

}