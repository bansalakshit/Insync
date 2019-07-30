import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle } from '@fortawesome/free-solid-svg-icons'
import { formatTime } from '../helpers'
import { format } from 'path';

class Timer extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            seconds: 0,
            isRunning: false,
            className: 'text-danger'
        }
        this.timerId = null
    }

    runTimer() {
        this.setState({
            isRunning: true
        })
        this.timerId = window.setInterval(() => {
            this.setState({
                className: this.state.className === 'text-danger' ? 'text-muted' : 'text-danger', 
                seconds: this.state.seconds += 1
            })
        }, 1000)
    }

    stopTimer() {
        this.setState({
            isRunning: false
        })
        window.clearInterval(this.timerId)
    }

    componentWillMount() {
        this.setState({
            seconds: Number(this.props.seconds)
        })
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
        return (
            <span className="timer2">
                <span className={`blinker ${this.state.isRunning ? `${this.state.className}` : 'text-muted'}`}><FontAwesomeIcon icon={faCircle}/></span>
                <span className="value">{formatTime(this.state.seconds)}</span>
            </span>
        )
    }

}

export default Timer