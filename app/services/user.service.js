
import { commonService } from './common.service'
import { authHeader } from '../helpers'

function list() {
    return commonService.getRequest('/user', '')
}

function profile() {
    return commonService.getRequest('/user/me', '')
}

function updateProfile(_data) {
    return commonService.postRequest('/user/update', _data)
}


function updateProfileImage(_data) {
    return commonService.postRequest('/user/profile/update', _data, authHeader())
}

export const userService = {
    updateProfileImage,
    list,
    profile,
    updateProfile,
}