import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer from '../reducers'

export const store = () => { 
    return createStore(
        rootReducer,
        composeWithDevTools(applyMiddleware(
            thunkMiddleware
        ))
    )
}