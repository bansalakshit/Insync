import moment from 'moment'
import Log from "../models/log"
import Job from "../models/job"
import  User from "../models/user"

import {
    toObjectId
} from "./utils"

export async function getEmployeesID(_ownerId, _jobIds) {
    let param1 = [ { owner: toObjectId(_ownerId) } ]
    let param2 = [ { managers: { $elemMatch: { user: toObjectId(_ownerId) } }} ]

    if(_jobIds) {
        param1.push({
            _id: { $in : _jobIds }
        })
        param2.push({
            _id: { $in : _jobIds }
        })
    }

    let results = await Job.find({
                            $or: [
                                { $and: param1 },
                                { $and: param2 }
                            ]
                        })
                        .populate('freelancers.user', 'profile')
    let freelancers = []
    if(results) {
        results.forEach(_result => {
            if(_result.freelancers.length > 0) {
                _result.freelancers.forEach(f => {
                    freelancers.push(f.user._id)
                })
            }
        })
    }
    return freelancers
}

let getSeconds = (_freelancerId, _start, _end, _jobIds) => {
    return new Promise((resolve, reject) => {
        Log.aggregate([
            {
                $match: { 
                    user: toObjectId(_freelancerId),
                    job: { $in: _jobIds },
                    start: { $gte: _start },
                    end: { $lte: _end }
                }
            },  
            {
                "$group": {
                    "_id": { "user_id": "$user" },
                    "totalSeconds": {
                        "$sum": {
                            "$divide": [
                                { "$subtract": [ "$end", "$start" ] },
                                1000
                            ]
                        }
                    }
                }
            }
         ])
         .exec((err, results) => {
            if(err) {
                reject(err)
            } else {
                resolve(Math.round((results && results.length > 0 && results[0].totalSeconds) ? results[0].totalSeconds : 0))
            }
        })
    })
}


let getTasksSeconds = (_jobId, _freelancerId, _start, _end) => {
    return new Promise((resolve, reject) => {
        Log.aggregate([
            {
                $match: { 
                    job: toObjectId(_jobId),
                    user: toObjectId(_freelancerId),
                    start: { $gte: _start },
                    end: { $lte: _end }
                }
            },  
            {
                "$group": {
                    "_id": { "user": "$user", "task": "$task" },
                    "totalSeconds": {
                        "$sum": {
                            "$divide": [
                                { "$subtract": [ "$end", "$start" ] },
                                1000
                            ]
                        }
                    }
                }
            }
         ])
         .exec((err, results) => {
            if(err) {
                reject(err)
            } else {
                resolve(results)
            }
        })
    })
}


let getEmployeeTaskSeconds = (_employeeId, _taskId, _taskDescription) => {
    return new Promise((resolve, reject) => {
        Log.aggregate([
            {
                $match: { 
                    user: toObjectId(_employeeId),
                    $or: [
                        { taskId: toObjectId(_taskId) },
                        { task: _taskDescription }
                    ]
                }
            },  
            {
                "$group": {
                    "_id": { "user": "$user" },
                    "totalSeconds": {
                        "$sum": {
                            "$divide": [
                                { "$subtract": [ "$end", "$start" ] },
                                1000
                            ]
                        }
                    }
                }
            }
         ])
         .exec((err, results) => {
            if(err) {
                reject(err)
            } else {
                resolve(results)
            }
        })
    })
}


export async function employeeTaskLogTime(_employeeId, _task) {
    let res = await getEmployeeTaskSeconds(_employeeId, _task._id, _task.description)
    let log = await Log.findOne({
                            user: toObjectId(_employeeId),
                            // end: { $gte: moment().subtract(5, "minutes") }
                        })
                        .sort({end: -1})
    let current = false
    if(log) {
        if(log.taskId.toString() === _task._id.toString()) {
            current = true
        } else {
            if(log.task === _task.description)
                current = true
        }
    }
    return {
        seconds: (res.length > 0) ? res[0].totalSeconds : 0,
        info: _task,
        current: current
    }
}

export async function dayTotalSeconds(_freelancerId, _date, _jobIds) {
    let start = new Date(moment(_date).format('YYYY-MM-DD 00:00:00'))
    let end = new Date(moment(_date).format('YYYY-MM-DD 23:59:59'))

    return {
        date: moment(_date).format('YYYY-MM-DD'),
        seconds: await getSeconds(_freelancerId, start, end, _jobIds)
    }
}

export async function lastScreenshot(_freelancerId, _jobIds) {
    let log = await Log.findOne({ user: toObjectId(_freelancerId), job: { $in: _jobIds } } )
                        .sort({end: -1})
    return log
}

export async function tasksLogToday(_freelancerId, _jobId) {
    let start = new Date(moment().format('YYYY-MM-DD 00:00:00'))
    let end = new Date(moment().format('YYYY-MM-DD 23:59:59'))
    return await getTasksSeconds(_jobId, _freelancerId, start, end)
}

export async function logToday(_freelancerId, _jobIds) {
    let start = new Date(moment().format('YYYY-MM-DD 00:00:00'))
    let end = new Date(moment().format('YYYY-MM-DD 23:59:59'))
    return await getSeconds(_freelancerId, start, end, _jobIds)
}

export async function logYesterday(_freelancerId, _jobIds) {
    let yesterday = moment().subtract(1, 'day')
    let start = new Date(yesterday.format('YYYY-MM-DD 00:00:00'))
    let end = new Date(yesterday.format('YYYY-MM-DD 23:59:59'))
    return await getSeconds(_freelancerId, start, end, _jobIds)
}

export async function logThisWeek(_freelancerId, _jobIds) {
    let start = new Date(moment().startOf("isoWeek").format('YYYY-MM-DD 00:00:00'))
    let end = new Date(moment().endOf("isoWeek").format('YYYY-MM-DD 23:59:59'))
    return await getSeconds(_freelancerId, start, end, _jobIds)
}

export async function logThisMonth(_freelancerId, _jobIds) {
    let start = new Date(moment().startOf("month").format('YYYY-MM-DD 00:00:00'))
    let end = new Date(moment().endOf("month").format('YYYY-MM-DD 23:59:59'))
    return await getSeconds(_freelancerId, start, end, _jobIds)
}

export async function logCustomDate(_freelancerId, _start, _end, _jobIds) {
    let start = new Date(moment(_start).format('YYYY-MM-DD 00:00:00'))
    let end = new Date(moment(_end).format('YYYY-MM-DD 23:59:59'))

    let screenshots = await Log.find({
                job: { $in: _jobIds },
                user: toObjectId(_freelancerId),
                start: { $gte: start },
                end: { $lte: end }
            })
            .populate('job', 'title description')
            .sort({_id: 1})
    return {
        screenshots: screenshots,
        seconds: await getSeconds(_freelancerId, start, end, _jobIds)
    }
}

export async function getLastSixLogs (_freelancerId, _jobIds) {
    let user = await User.findOne(toObjectId(_freelancerId)).select('profile')
    let logs = await Log.find({
                user: toObjectId(_freelancerId),
                job: { $in : _jobIds }
            })
            .populate('job', 'name')
            .sort({_id: -1})
            .limit(6)

    return {
        _id: user._id,
        profile: user.profile,
        screenshots: logs,
        today: await logToday(_freelancerId, _jobIds)
    }
}