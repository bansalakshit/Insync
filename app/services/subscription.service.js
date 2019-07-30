
import { commonService } from './common.service';

const subscribe = (_email, _referrer) => {
    return commonService.postRequest('/subscription', {email: _email, referrer: _referrer}, {})
}

const activate = (_token) => {
    return commonService.getRequest('/subscription/activate', [_token], {})
}

const account = (_id) => {
    return commonService.getRequest('/subscription/account', [_id], {})
}

export const subscriptionService = {
    subscribe,
    activate,
    account
};

