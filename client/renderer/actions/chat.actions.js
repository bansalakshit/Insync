import { alertActions } from "./";
import { chatService } from "../services";
import { chatConstants } from "../constants";

const addMessage = _res => {
    return {
        type: chatConstants.ADD_MESSAGE,
        payload: {
            data: _res
        }
    };
};


const updateUnseen = _count => {
    return {
        type: chatConstants.UPDATE_UNSEEN,
        payload: {
            data: _count
        }
    };
};

const getMessages = _roomId => {
    return dispatch => {
        dispatch({ type: chatConstants.MESSAGES_LOADING });
        chatService.messages(_roomId).then(
            _res => {
                dispatch({
                    type: chatConstants.MESSAGES_SUCCESS,
                    payload: {
                        data: _res
                    }
                });
            },
            _err => {
                dispatch({ type: chatConstants.MESSAGES_FAILURE });
                dispatch(alertActions.error(_err));
            }
        );
    };
};

const getHistory = (_roomId, _lastMessageId) => {
    return dispatch => {
        dispatch({ type: chatConstants.MESSAGES_HISTORY_LOADING });
        chatService.messages(_roomId, _lastMessageId).then(
            _res => {
                dispatch({
                    type: chatConstants.MESSAGES_HISTORY_SUCCESS,
                    payload: {
                        data: _res
                    }
                });
            },
            _err => {
                dispatch({ type: chatConstants.MESSAGES_HISTORY_FAILURE });
                dispatch(alertActions.error(_err));
            }
        );
    };
};


const updateMessageStatus = (_roomId, _messageId) => {
    return dispatch => {
        chatService.seen(_roomId, _messageId).then(
            _res => {
                dispatch({
                    type: chatConstants.MESSAGE_VIEWED,
                    payload: {
                        data: _res.data
                    }
                });
            },
            _err => {}
        );
    };
};


const createRoom = (_jobId, _employeeId) => {
    return dispatch => {
        dispatch({ type: chatConstants.CREATE_ROOM_LOADING });
        chatService.createRoom(_jobId, _employeeId).then(
            _res => {
                dispatch({
                    type: chatConstants.CREATE_ROOM_SUCCESS,
                    payload: {
                        data: _res
                    }
                });
                dispatch(getMessages(_res._id));
            },
            _err => {
                dispatch({ type: chatConstants.CREATE_ROOM_FAILURE });
                dispatch(alertActions.error(_err));
            }
        );
    };
};

export const chatActions = {
    updateUnseen,
    updateMessageStatus,
    getMessages,
    getHistory,
    addMessage,
    createRoom
};
