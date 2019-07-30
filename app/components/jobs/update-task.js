import React from 'react'
import { connect } from 'react-redux'

import { Input } from 'reactstrap'

import { jobService } from '../../services'

class UpdateTask extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isUpdate: false,
            value: ''
        }

        this.showForm = this.showForm.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleKeyDown = this.handleKeyDown.bind(this)
    }

    componentDidMount() {
        this.setState({
            value: this.props.value
        })
    }

    handleChange(e) {
        const { name, value } = e.target
        this.setState({
            [name]: value
        })
    }

    handleKeyDown(e) {
        if(e.keyCode === 13)
            this.handleSubmit()
    }

    handleSubmit() {
        jobService.updateTask(this.props.taskId, { field: this.props.field, value: this.state.value })
            .then(_res => {
                this.setState({
                    isUpdate: false
                })
            })
    }

    showForm(_status) {
        this.setState({
            isUpdate: true
        })
        setTimeout(() => {
            if(this.textInput)
                this.textInput.focus()
        }, 100)
    }

    render() {
        return (
            <React.Fragment>
                {
                    (()=>{
                        if(this.state.isUpdate) {
                            return (
                                <Input autoFocus ref={elem => (this.textInput = elem)} type="text" name="value" value={this.state.value} onChange={this.handleChange} onBlur={this.handleSubmit} onKeyDown={this.handleKeyDown}/>
                            )
                        } else {
                            if(this.props.field === 'link') {
                                return (
                                    <div onClick={this.showForm}>
                                        <a href={this.state.value} target="_blank">Details</a>
                                    </div>
                                )
                            } else {
                                return (
                                    <div onClick={this.showForm}>{this.state.value}</div>
                                )
                            }
                        }
                    })()
                }
            </React.Fragment>
        )
    }

}

export default connect()(UpdateTask)
