
import { Router } from "express"
import list from "./list"
import inviteFreelancer from "./invite-freelancer"
import acceptInvitation from "./accept"
import join from "./join"
import tasks from "./tasks"
import employees from "./employees"
import archive from "./archive"
import userTasks from "./user-tasks"
import userJobs from "./user-jobs"
import manager from "./manager"

export default() => {

    let router = Router()

    router.use('/', list())
    router.use('/invite-freelancer', inviteFreelancer())
    router.use('/accept-invitation', acceptInvitation())
    router.use('/join', join())
    router.use('/tasks', tasks())
    router.use('/user-tasks', userTasks())
    router.use('/user-jobs', userJobs())
    router.use('/employees', employees())
    router.use('/archive', archive())
    router.use('/manager', manager())

    return router

}
