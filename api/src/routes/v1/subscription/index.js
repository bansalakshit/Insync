
import { Router } from "express"
import subscribe from "./subscribe"
import activate from "./activate"
import account from "./account"

export default() => {

    let router = Router()

    router.use('/', subscribe())
    router.use('/activate', activate())
    router.use('/account', account())

    return router

}
