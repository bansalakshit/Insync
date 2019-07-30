import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'


import { jobService } from '../../services'

class RemoveTask extends React.Component {

    constructor(props) {
        super(props)
        this.remove = this.remove.bind(this)
    }

    remove() {
        jobService.removeTask(this.props.jobId, this.props.taskId, this.props.userId) 
            .then(_res => {
                if(this.props.callback)
                    this.props.callback()
            })
    }

    render() {
        return (
            <span onClick={this.remove} style={{marginLeft: '15px'}} className="pointer text-danger"><FontAwesomeIcon icon={faTimes}/> </span>
        )
    }

}

export default RemoveTask
