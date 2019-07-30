import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { createLogger } from 'redux-logger'
import rootReducer from '../reducers'

const loggerMiddleware = createLogger()

export const store = () => { 
    return createStore(
        rootReducer,
        composeWithDevTools(applyMiddleware(
            thunkMiddleware,
            loggerMiddleware
        ))
    )
}