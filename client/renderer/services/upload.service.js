import { commonService } from './common.service'

function upload(_file) {
    return commonService.uploadRequest(`/upload`, _file)
}

export const uploadService = {
    upload,
}