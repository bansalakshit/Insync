
import { Router } from "express"
import profile from "./profile"
import update from "./update"
import list from "./list"
import ping from "./ping"
import updateProfile from "./update-profile-image"


export default() => {

    let router = Router()

	router.use('/', list())
	router.use('/ping', ping())
	router.use('/me', profile())
	router.use('/update', update())
	router.use('/profile', updateProfile())

    return router

}
