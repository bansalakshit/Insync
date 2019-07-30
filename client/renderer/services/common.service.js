import { handleResponse } from '../helpers'
require('es6-promise').polyfill()
require('isomorphic-fetch')
import * as fs from 'fs'

import { apiConfig } from '../config'

function getRequest(_url, _params, _header) {
    const requestOptions = {
        method: 'GET',
        headers: Object.assign({ 'Content-Type': 'application/json' }, {'src': 'app'}, _header)
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
        headers: Object.assign({ 'Content-Type': 'application/json' }, {'src': 'app'}, _header)
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
    // if(Array.isArray(_files)) {
    //     _files.forEach(_file => {
    //         data.append('img', fs.createReadStream(_file) )
    //     })
    // } else {
    //     data.append('img', fs.createReadStream(_files) )
    // }
    console.log(_files[0])
    data.append('img', _files[0], {
        filename: "image.png",
        contentType: 'image/png'
      })
    // let datas = data.entries();              
    // var obj = datas.next();
    // var retrieved = {};             
    // while(undefined !== obj.value) {    
    //     retrieved[obj.value[0]] = obj.value[1];
    //     obj = datas.next();
    // }
    // console.log('retrieved: ',retrieved);

    const requestOptions = {
        method: 'POST',
        headers: Object.assign({ 'content-type': 'application/json', 'Content-Type': 'multipart/form-data' }, {'src': 'app'}, _header),
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
    postRequest
}