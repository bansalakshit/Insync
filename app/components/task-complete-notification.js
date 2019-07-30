import React from 'react'
import {
    userInfo
} from '../helpers'

class TaskCompleteNotification extends React.Component {

    showNotification(_message) {
        let notification = new window.Notification('InSync Team', {
            body: _message
        })
        setTimeout(notification.close.bind(notification), 5000)
    }

    notify(_message) {
        if (!("Notification" in window)) {
            alert(_message)
        }

        else if (Notification.permission === "granted") {
            this.showNotification(_message)
        }

        else if (Notification.permission !== 'denied') {
            Notification.requestPermission( _permission => {
                if (_permission === "granted") {
                    this.showNotification(_message)
                }
            })
        }
    }

    componentDidMount() {

        let user = userInfo()
        if (typeof emitter !== 'undefined' && user) {
            let client = emitter.connect({
                secure: true
            })
            client.on('connect', () => {
                client.subscribe({
                    key: user.profile.channel_key,
                    channel: `InSync/${user._id}/employee/+/doneTask`
                })
            })
            client.on('message', _data => {
                if (_data.binary) {
                    let data = JSON.parse(_data.binary.toString())
                    let task = data.task
                    let user = data.user
                    let message = `${task.description} was already completed by ${user.profile.first_name} ${user.profile.last_name}`
                    this.notify(message)
                }
            })
        }

    }

    render() {
        return ''
    }

}

export default TaskCompleteNotification