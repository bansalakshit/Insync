
import { commonService } from './common.service'
import { authHeader } from '../helpers'

function profile() {
    return commonService.getRequest('/user/me', '', authHeader())
}

function ping() {
    return commonService.getRequest('/user/ping', '', authHeader())
}

export const userService = {
    ping,
    profile
}