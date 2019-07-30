import dotenv from 'dotenv'
import {
    logThisMonth,
    logThisWeek,
    logToday,
    logYesterday,
    lastScreenshot,
    getLastSixLogs
} from "./log"
import { countUnseen } from './chat'
import  User from "../models/user"
import Room from "../models/room";
import  Task from "../models/task"
const emitter = require('emitter-io')
const client = emitter.connect()

dotenv.config()

let broadcast = (_key, _channel, _message) => {
    client.publish({
		key: _key,
		channel: _channel,
		message: _message
	});
}

// **** OWNERS EMITTER CHANNEL

// channel InSync/$ownerId/employee/$userId/doneTask
export async function doneTask(_userId, _taskId) {

    try {
        let task = await Task.findById(_taskId).populate('job')
        let owner = await User.findById(task.job.owner).select('profile')
        let user = await User.findById(_userId).select('profile')
        console.log(`InSync/${owner._id}/employee/${_userId}/doneTask`)
        if(task && user && owner) {
            broadcast(
                owner.profile.channel_key,
                `InSync/${owner._id}/employee/${_userId}/doneTask`, 
                JSON.stringify({
                    user: user,
                    task: task
                })
            )
        }
    } catch(_err) {
        console.log(_err)
        //TODO: log error
    }

}

// channel InSync/$ownerId/employee/$userId/latestScreenshots
export async function latestScreenshots(_ownerId, _userId, _jobId) {

    try {
        let owner = await User.findById(_ownerId).select('profile')
        let data = await getLastSixLogs(_userId, [_jobId])
        
        broadcast(
            owner.profile.channel_key,
            `InSync/${_ownerId}/employee/${_userId}/latestScreenshots`, 
            JSON.stringify(data)
        )
        
    } catch(_err) {
        console.log(_err)
        //TODO: log error
    }

}

// channel InSync/$ownerId/employee/$userId/latestLogTime
export async function latestLogTime(_ownerId, _userId, _jobId) {

    try {
        let owner = await User.findById(_ownerId).select('profile')

        let data = {}
        data.user = await User.findById(_userId).select('profile')

        let lastActive = await lastScreenshot(_userId, [_jobId])
        let today = await logToday(_userId, [_jobId])
        let yesterday = await logYesterday(_userId, [_jobId])
        let week = await logThisWeek(_userId, [_jobId])
        let month = await logThisMonth(_userId, [_jobId])

        data.lastActive = lastActive ? lastActive.end : null,
        data.logs = {
                lastActive: lastActive,
                today: today,
                yesterday: yesterday,
                week: week,
                month: month,
            }

        broadcast(
            owner.profile.channel_key,
            `InSync/${_ownerId}/employee/${_userId}/latestLogTime`, 
            JSON.stringify(data)
        )
        
    } catch(_err) {
        console.log(_err)
        //TODO: log error
    }

}

// **** USER EMITTER CHANNEL

// channel InSync/$userId/newJob
export async function newJob(_userId, _jobInfo) {
    let user = await User.findById(_userId).select('profile')
    broadcast(
        user.profile.channel_key, 
        `InSync/${_userId}/newJob`, 
        JSON.stringify(_jobInfo)
    )
}


// channel InSync/$userId/newTask
export async function newTask(_userId, _taskInfo) {
    let user = await User.findById(_userId).select('profile')
    broadcast(
        user.profile.channel_key, 
        `InSync/${_userId}/newTask`, 
        JSON.stringify(_taskInfo)
    )
}


// channel InSync/$userId/removeTask
export async function removeTask(_userId, _taskInfo) {
    let user = await User.findById(_userId).select('profile')
    broadcast(
        user.profile.channel_key, 
        `InSync/${_userId}/removeTask`, 
        JSON.stringify(_taskInfo)
    )
}

// channel InSync/$userId/newLog
export async function newLog(_userId, _jobId) {
    let user = await User.findById(_userId).select('profile')
    let totalSeconds = await logToday(_userId, [_jobId])
    broadcast(
        user.profile.channel_key, 
        `InSync/${_userId}/newLog`, 
        JSON.stringify({totalSeconds: totalSeconds})
    )
}

// channel InSync/$userId/newMessage
export async function newMessage(_res) {
    const room = await Room.findById(_res.message.room)
                .populate('members.user', 'profile')
    if(room) {
        room.members.forEach(async _member => {
            if(_member.user._id.toString() !== _res.message.from._id.toString()) {
                const count = await countUnseen(room._id, _member.user._id)
                _res.unseen = count;
                broadcast(
                    _member.user.profile.channel_key, 
                    `InSync/${_member.user._id}/newMessage`, 
                    JSON.stringify(_res)
                )
            }
        })
    }
}


// channel InSync/$userId/unseen
export async function unseenMessages(_roomId, _userId) {
    const user = await User.findById(_userId).select('profile')
    const count = await countUnseen(_roomId, user._id)
    broadcast(
        user.profile.channel_key, 
        `InSync/${user._id}/unseen`, 
        JSON.stringify({count: count})
    )
}