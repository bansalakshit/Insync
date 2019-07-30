import {
    chatConstants
} from '../constants';

export function chat(state = {
    loading: false,
    error: false,
    loading_history: false,
    messages: [],
    messagesId: (new Date()).getTime(),
    lastMessageId: null,
    unseen: 0,
}, action) {
    switch (action.type) {
        case chatConstants.CREATE_ROOM_LOADING:
            return {
                ...state,
                loading_room: true
            }
        case chatConstants.CREATE_ROOM_SUCCESS:
            return {
                ...state,
                loading_room: false,
                room: action.payload.data
            }

        case chatConstants.MESSAGES_LOADING:
            return {
                ...state, 
                loading: true,
                error: false
            }
        case chatConstants.MESSAGES_SUCCESS:
            return {
                ...state,
                loading: false,
                messages: action.payload.data.messages,
                lastMessageId: action.payload.data.lastMessageId,
                unseen: action.payload.data.unseen,
                messagesId: (new Date()).getTime()
            }
        case chatConstants.MESSAGES_FAILURE:
            return { 
                ...state,
                loading: false,
                error: true
            }

        case chatConstants.MESSAGES_HISTORY_LOADING:
            return {
                ...state,
                loading_history: true
            }
        case chatConstants.MESSAGES_HISTORY_SUCCESS:
            return {
                ...state,
                loading_history: false,
                lastMessageId: action.payload.data.lastMessageId,
                messages:  action.payload.data.messages.concat(state.messages)
            }

        case chatConstants.ADD_MESSAGE:
            let i = state.messages.findIndex(o => o._id === action.payload.data._id);
            if(i > -1) {
                return state
            } else {
                return {
                    ...state,
                    // lastMessageId: action.payload.data.message._id,
                    messages:  state.messages.concat([action.payload.data.message]),
                    unseen: (typeof action.payload.data.unseen !== 'undefined') ? action.payload.data.unseen : 0,
                    messagesId: (new Date()).getTime()
                }
            }

        case chatConstants.MESSAGE_VIEWED:
            console.log(action.payload.data)
            // let index = state.messages.findIndex(o => o._id === action.payload.data.messageId);
            // let message = state.messages.find(o => o._id === action.payload.data.messageId);
            // message.status = 'viewed'
            // let messages = state.messages
            // messages[index] = message
            return {
                ...state,
                // messages:  messages
            }
        
        case chatConstants.UPDATE_UNSEEN:
            return {
                ...state,
                unseen: action.payload.data
            }

        default:
            return state
    }
}