import { combineReducers } from 'redux'

import { authentication } from './authentication.reducer'
import { alert } from './alert.reducer'
import { request } from './request.reducer'
import { logToday } from './log-today.reducer'
import { user } from './user.reducer'
import { config } from './config.reducer'
import { tracker } from './tracker.reducer'
import { chat } from './chat.reducer'

const rootReducer = combineReducers({
    authentication,
    alert,
    request,
    logToday,
    user,
    config,
    tracker,
    chat
})

export default rootReducer