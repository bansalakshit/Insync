import React from 'react'
import { ipcRenderer } from 'electron'

class IdleDetector extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isRunning: false
        }
        this.timerId = null
    }

    runTimer() {
        this.setState({
            isRunning: true,
        })
        ipcRenderer.on('idleTime', (event, arg) => {
            if(arg >= this.props.idleThreshold) {
                if(this.props.pauseCallback) {
                    this.props.pauseCallback()
                }
            } else {
                if(this.props.resumeCallback) {
                    this.props.resumeCallback()
                }
            }
        })
        this.timerId = window.setInterval(() => {
            ipcRenderer.send('checkIdleTime', 'check')
        }, 1000)
    }

    stopTimer() {
        this.setState({
            isRunning: false
        })
        window.clearInterval(this.timerId)
    }

    componentDidUpdate(prevProps) {
        if(prevProps.run !== this.props.run) {
            if(this.props.run)
                this.runTimer()
            else
                this.stopTimer()
        }
    }

    componentDidMount() {
        if(this.props.run)
            this.runTimer()
    }

    componentWillUnmount() {
        this.stopTimer()
    }

    render() {
        return ('')
    }

}

export default IdleDetector