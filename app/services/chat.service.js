
import { commonService } from './common.service'
import { authHeader } from '../helpers'

function messages(_roomId, _lastMessageId) {
    let params = [_roomId];
    if(_lastMessageId)
        params.push(_lastMessageId)
    return commonService.getRequest('/chat', params, authHeader())
}

function newMessage(_roomId, _users, _msg) {
    return commonService.postRequest(`/chat/new`, {room: _roomId, users: _users, message: _msg}, authHeader())
}

const seen = (_roomId, _messageId) => {
    let params = [_roomId, _messageId];
    return commonService.getRequest('/chat/seen', params, authHeader())
}

const unseenCount = (_roomId) => {
    return commonService.getRequest(`/chat/unseen/${_roomId}/count`, '', authHeader())
}

function createRoom(_jobId, _employeeId) {
    return commonService.getRequest(`/chat/room/create`, [_jobId, _employeeId], authHeader())
}

export const chatService = {
    seen,
    unseenCount,
    createRoom,
    messages,
    newMessage
}