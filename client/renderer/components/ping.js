import React from 'react'
import { userService } from '../services'

class Ping extends React.Component {

    constructor(props) {
        super(props)
        this.timerId = null
    }

    runTimer() {
        this.timerId = window.setInterval(() => {
            userService.ping()
        }, 1000 * 75)
    }

    stopTimer() {
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
        this.runTimer()
    }

    componentWillUnmount() {
        this.stopTimer()
    }

    render() {
        return ('')
    }

}

export default Ping