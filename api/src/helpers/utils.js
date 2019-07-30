import util from "util"
import MailGun from "mailgun-js"
import mongoose from 'mongoose'
import Token from "../models/token"

const ObjectId = mongoose.Types.ObjectId

export function toObjectId(_id) {
	try {
		return ObjectId(_id)
	} catch(_e) {
		return null
	}
}

export function imageFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false)
    }
    cb(null, true)
}


export function validateToken() {

	return (_req, _res, _next) => {
		let token = _req.headers.authorization.replace('Bearer ', '')
		return Token.findOne({
				user: toObjectId(_req.user._id),
				src: _req.headers.src,
				hash: token
			})
			.then(_token => {
				if(_req.headers.src === 'web') {
					_next()
				} else {
					if(_token) {
						_next()
					} else {
						_req.logout()
						_next()
					}
				}
			})
			.catch(_err => {
				_next(_err)
			})
	}

}

export function convertError(_errors) {

	if (typeof _errors === 'object')
		return new Error(JSON.stringify(_errors.map(err => {
			return {
				description: err.msg,
				field: err.param
			}
		})))
	else
		return new Error(_errors)

}

export function convertJSON(_str) {

	let str = null
	try {
		str = JSON.parse(_str)
	} catch (e) {
		str = _str
	}
	return str

}

export function respond() {

	return (_req, _res, _next) => {
		_res.status(200).json(_req.responseData)
	}

}

export function error() {
	return (err, req, res, next) => {

		if (!err) err = new Error('an error has occurred')
		var code = err.status || 500

		util.log(util.format('Error [%s]: %s', req.url, err.message))
		if (code !== 404 && code !== 403) {
			// not logging traces for 404 and 403 errors
			util.log(util.inspect(err.stack))
		}

		if ('ETIMEDOUT' === err.code || 'ENOTFOUND' === err.code) {
			err.message = 'Error connecting upstream servers'
		}

		if ('POST' === req.method) {
			if (err.status === 403) {
				err.errorDetails = 'Session and/or token expired.'
			}
		}
		if (req.xhr || req.isapi) {
			res.json({
				code: code || 1,
				success: false,
				error: err.message,
				message: err.errorDetails || err.message
			})
		} else {
			// if error is string
			res.status(400).send({
				message: convertJSON(err.message),
				success: false,
			})
		}
	}
}

export function sendEmail(_from, _to, _title, _message) {

	return new Promise((_resolve, _reject) => {
		let mailgun = new MailGun({
			apiKey: process.env.MAILGUN_API_KEY,
			domain: process.env.MAILGUN_DOMAIN
		})

		let data = {
			from: _from ? _from : `${process.env.EMAIL_NAME} <${process.env.EMAIL_FROM}>`,
			to: _to,
			subject: _title,
			text: _message
		}

		mailgun.messages()
			.send(data, (_error, _body) => {

				if (_error) {
					// TODO: log error
					_reject(_error)
				} else {
					_resolve(_body)
				}

			})
	})

}

export function isAdmin(_req) {
	return _req.user ? _req.user.roles.some(el => ['admin'].indexOf(el) >= 0) : false
}

export function adminOnly(_req, _res, _next) {
	if (_req.isAuthenticated() && _req.user.roles.some(el => ['admin'].indexOf(el) >= 0)) {
		return _next()
	} else {
		_next(new Error('Unauthorized user.'))
	}
}

export function isAuthenticated(_req, _res, _next) {
	if (_req.isAuthenticated()) {
		return _next()
	} else {
		_next(new Error('Unauthorized user. Please sign in.'))
	}
}