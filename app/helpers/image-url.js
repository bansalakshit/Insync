import { apiConfig } from '../config';

export function imgURL(_img) {
    return `${apiConfig.rootUrl}/uploads/${_img}`;
}