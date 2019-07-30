import { apiConfig } from '../config'
import { handleResponse } from '../helpers'
require('es6-promise').polyfill()
require('isomorphic-fetch')

function getRequest(_url, _params, _header) {
    const requestOptions = {
        method: 'GET',
        headers: Object.assign({ 'Content-Type': 'application/json' }, {'src': 'web'}, _header),
        credentials: 'include'
    }

    let _paramsStr = ''
    if(typeof _params === "object")
        _paramsStr = _params.join('/')
    
    if(_params)
        _paramsStr = `/${_paramsStr}`

    return fetch(`${apiConfig.apiUrl}${_url}${_paramsStr}`, requestOptions)
        .then(handleResponse)
        .then(res => {
            return res
        })
}

function postRequest(_url, _body, _header) {
    const requestOptions = {
        method: 'POST',
        headers: Object.assign({ 'Content-Type': 'application/json' }, {'src': 'web'}, _header),
        credentials: 'include',
    }

    if(_body)
        requestOptions.body = JSON.stringify(_body)

    return fetch(`${apiConfig.apiUrl}${_url}`, requestOptions)
        .then(handleResponse)
        .then(res => {
            return res
        })
}


function putRequest(_url, _body, _header) {
    const requestOptions = {
        method: 'PUT',
        headers: Object.assign({ 'Content-Type': 'application/json' }, {'src': 'web'},_header),
        credentials: 'include',
    }

    if(_body)
        requestOptions.body = JSON.stringify(_body)

    return fetch(`${apiConfig.apiUrl}${_url}`, requestOptions)
        .then(handleResponse)
        .then(res => {
            return res
        })
}

function uploadRequest(_url, _files, _header) {
    const data = new FormData()
    if(Array.isArray(_files)) {
        _files.forEach(_file => {
            data.append('img', _file )
        })
    } else {
        data.append('img', _files )
    }
    
    const requestOptions = {
        method: 'POST',
        headers: Object.assign({ 'Accept': 'application/json' }, {'src': 'web'}, _header),
        credentials: 'include',
        body: data
    }


    return fetch(`${apiConfig.apiUrl}${_url}`, requestOptions)
        .then(handleResponse)
        .then(res => {
            return res
        })
}

export const commonService = {
    uploadRequest,
    getRequest,
    putRequest,
    postRequest
}