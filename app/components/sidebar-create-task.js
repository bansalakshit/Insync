import React from 'react'
import { connect } from 'react-redux'
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap'

import { jobService } from '../services'
import { alertActions, jobActions, userTaskActions } from '../actions'

class SidebarCreateTask extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            task: '',
            link: '',
            priority: 1,
            submitted: false,
            loading: false,
            processing: false
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(e) {
        const { name, value } = e.target
        this.setState({
            [name]: value
        })
    }

    handleSubmit(e) {
        e.preventDefault()
        if(!this.state.processing) {
            this.setState({ submitted: true })
            if(this.state.task && this.state.priority) {
                this.setState({ processing: true })
                jobService.createTask(this.props.jobId, {task: this.state.task, link: this.state.link, priority: this.state.priority, users: [this.props.userId]})
                    .then(_res => {
                        this.setState({ submitted: false, processing: false, task: '', link: '', priority: 1})
                        this.props.dispatch(userTaskActions.getUserTasks(this.props.userId))
                        this.props.dispatch(jobActions.getTasks(this.props.jobId), false)
                        this.props.dispatch(alertActions.success('Employee was assigned successfully'))
                    })
                    .catch(_err => {
                        this.setState({ processing: false })
                        this.props.dispatch(alertActions.error(_err.message))
                    })
            }
        }
    }

    render() {
        return (

            <Form onSubmit={this.handleSubmit}>
                <FormGroup>
                    <Label>Description</Label>
                    <Input autoComplete="off" type="text" name="task" value={this.state.task} onChange={this.handleChange} />
                    {this.state.submitted && !this.state.task &&
                        <FormText color="danger">Task is required</FormText>
                    }
                </FormGroup>
                <FormGroup>
                    <Label>Link</Label>
                    <Input autoComplete="off" type="text" name="link" value={this.state.link} onChange={this.handleChange} />
                </FormGroup>
                <FormGroup>
                    <Label>Priority</Label>
                    <Input autoComplete="off" type="text" name="priority" value={this.state.priority} onChange={this.handleChange} />
                    {this.state.submitted && !this.state.priority &&
                        <FormText color="danger">Priority is required</FormText>
                    }
                </FormGroup>
                <FormGroup>
                    <Button disabled={this.state.processing} color="primary" onClick={this.handleSubmit}>{this.state.processing ? 'Please wait...' : 'Create'}</Button>
                </FormGroup>
            </Form>
        )
    }

}

export default connect()(SidebarCreateTask)
