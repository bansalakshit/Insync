
import { commonService } from './common.service'
import { authHeader } from '../helpers'

function config() {
    return commonService.getRequest('/', '')
}

export const configService = {
    config
}

