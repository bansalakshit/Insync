import {
    chatConstants
} from '../constants';

export function chat(state = {
    loading: false,
    error: false,
    loading_room: false,
    loading_room_error: false,
    loading_history: false,
    messages: [],
    messagesId: (new Date()).getTime(),
    lastMessageId: null
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
        case chatConstants.CREATE_ROOM_FAILURE:
            return {
                ...state,
                loading_room: false,
                loading_room_error: true
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
            let exist = state.messages.find(o => o._id === action.payload.data._id);
            if(exist) {
                return state
            } else {
                return {
                    ...state,
                    // lastMessageId: action.payload.data._id,
                    messages:  state.messages.concat([action.payload.data]),
                    messagesId: (new Date()).getTime()
                }
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