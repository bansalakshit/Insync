import { configConstants } from '../constants'
import { configService } from '../services'

export const configActions = {   
    get,
}


function get() {
    return dispatch =>{
        dispatch({type: configConstants.REQUEST_LOADING})
        configService.config().then(
            _res =>{
                dispatch({
                    type: configConstants.REQUEST_SUCCESS,
                    payload: {
                        data: _res
                    }
                })
            },
            _err => {
                dispatch({type: configConstants.REQUEST_FAILURE})
            }
        )
    }
}
