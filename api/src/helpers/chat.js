import Message from "../models/message";
import Room from "../models/room";

import { newMessage } from "./websocket";
import { toObjectId } from "./utils";

const doCount = async (_roomId, _userId) => {
    let count = 0;
    try {
        count = await Message.find({ 
                room: toObjectId(_roomId), 
                from: { $not : { $eq: toObjectId(_userId) } }, 
                views: { $not : { $elemMatch: { $eq: _userId.toString() } } } 
        }).countDocuments();
    } catch (_err) {}
    return count;
};

export async function countUnseen(_roomId, _userId) {
    return await doCount(_roomId, _userId);
}

export async function sendMessage(_from, _room, _tos, _message) {
    let doSend = async (_room, _from, _to, _message) => {
        let message = null;
        let unseen = 0;
        try {
            let msg = await Message.create({
                room: _room,
                text: _message,
                from: _from,
                to: _to
            });
            message = await Message.findById(msg._id)
                .populate("from", "profile username")
                .populate("to", "profile username");
            unseen = await doCount(_room, _from)
            newMessage({ message: message, unseen: unseen });
        } catch (_err) {}
        return { message: message, unseen: unseen };
    };

    try {
        if (Array.isArray(_tos)) {
            for (let i = 0; i < _tos.length; i++) {
                await doSend(_room, _from, _tos[i], _message);
            }
        } else {
            return await doSend(_room, _from, _tos, _message);
        }
    } catch (_err) {}
}

export async function isRoomMember(_roomId, _userId) {
    try {
        const room = await Room.findOne({
            _id: toObjectId(_roomId),
            members: { $elemMatch: { user: toObjectId(_userId) } }
        });
        return room ? true : false;
    } catch (_err) {
        return false;
    }
}
