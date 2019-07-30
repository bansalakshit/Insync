import { Router } from 'express'
import passport from 'passport'
import auth from './auth'
import user from './user'
import job from './job'
import log from './log'
import admin from './admin'
import chat from './chat'
import subscription from './subscription'

import { validateToken } from "../../helpers/utils" 
import Config from "../../models/config"


export default () => {
	let api = Router()

	api.use('/auth', auth())
	api.use('/user', passport.authenticate('jwt', { session : false }), validateToken(), user())
	api.use('/job', passport.authenticate('jwt', { session : false }), validateToken(), job())
	api.use('/log', passport.authenticate('jwt', { session : false }), validateToken(), log())
	api.use('/chat', passport.authenticate('jwt', { session : false }), validateToken(), chat())
	api.use('/subscription', subscription())
	api.use('/admin', admin())
	
	api.get('/', (req, res) => {
		return Config.findOne({})
			.then(_config => {
				res.json({
					version: _config ? _config.appVersion : '0'
				})
			})
	})

	return api
}
