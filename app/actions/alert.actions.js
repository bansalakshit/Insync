import { alertConstants } from '../constants';


const success = _message => {
    return { type: alertConstants.SUCCESS, _message };
}

const error = _message => {
    return { type: alertConstants.ERROR, _message };
}

const clear = () => {
    return { type: alertConstants.CLEAR };
}

export const alertActions = {
    success,
    error,
    clear
};