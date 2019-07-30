import {
    Router
} from "express"
import {
    respond,
    error,
    isAuthenticated,
    toObjectId
} from "../../../helpers/utils"
import Room from "../../../models/room"
import Job from "../../../models/job"

const doCreate = async (_jobId, _employeeId) => {
    const job = await Job.findById(_jobId);
    const name = `${_jobId}-${job.owner}-${_employeeId}`;
    let room = await Room.findOne({
        name: name,
        members: { $elemMatch: { user: toObjectId(_employeeId) } },
        members: { $elemMatch: { user: toObjectId(job.owner) } }
    })

    if(!room) {
        let members = [
            { role: 'employee', user: _employeeId },
            { role: 'employeer', user: job.owner }
        ]
        if(job.managers && job.managers.length > 0)
            job.managers.forEach(_manager => {
                members.push({
                    role: 'manager',
                    user: _manager.user
                })
            })
        room = await Room.create({
            name: name,
            job: _jobId,
            members: members
        })
    }

    return room;

}

let create = () => {
    return (_req, _res, _next) => {
        return doCreate(_req.params.jobId, _req.params.employeeId)
            .then(_result => {
                _req.responseData = _result
                _next()
            })
            .catch(_err=>_next(_err))
    }
}

export default () => {

    let router = Router()

    router.get('/create/:jobId/:employeeId',
        isAuthenticated,
        create(),
        respond(),
        error()
    )

    return router

}