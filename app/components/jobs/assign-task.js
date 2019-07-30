import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'next/router'

import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Form, FormGroup, Label, Input, FormText } from 'reactstrap'

import { jobService } from '../../services'
import { alertActions } from '../../actions'
import ProfileImg from '../../components/img'

class AssignTask extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            submitted: false,
            loading: false,
            processing: false,
            modal: false,
            employees: null,
            users: []
        }

        this.handleSubmit = this.handleSubmit.bind(this)
        this.toggle = this.toggle.bind(this)
        this.openModal = this.openModal.bind(this)
        this.handleSelectEmployee = this.handleSelectEmployee.bind(this)
    }

    handleSelectEmployee(e) {
        const { name, value } = e.target
        const status = e.target.checked
        let users = this.state.users
        if(status) {
            users.push(value)
        } else {
            users = users.filter(u => u!==value)
        }
        this.setState({
            users: users
        })
    }
  
    toggle() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }))
    }

    openModal() {
        this.setState({
            modal: true,
            loading: true
        })
        jobService.employees(this.props.jobId)
            .then(_res => {
                this.setState({
                    employees: _res
                })
            })
    }

    handleSubmit(e) {
        e.preventDefault()
        if(!this.state.processing) {
            this.setState({ submitted: true })
            if(this.props.taskId && this.props.jobId) {
                this.setState({ processing: true })
                jobService.assignTask(this.props.jobId, this.props.taskId, {users: this.state.users})
                    .then(_res => {
                        this.setState({ submitted: false, processing: false, users: [] })
                        document.querySelectorAll('input[type=checkbox]').forEach( el => el.checked = false )
                        if(this.props.callback)
                            this.props.callback()
                    })
                    .catch(_err => {
                        this.setState({ processing: false })
                    })
            }
        }
    }

    render() {
        return (
            <React.Fragment>
                <Button color="primary" onClick={this.openModal}>Assign Task</Button>
                <Modal backdrop="static" isOpen={this.state.modal}>
                    <ModalHeader>Select Employees</ModalHeader>
                    {
                        (()=>{
                            if(this.state.employees) {
                                return (
                                    <React.Fragment>
                                        <ModalBody>
                                            <Form onSubmit={this.handleSubmit}>
                                                {
                                                    (()=>{
                                                        if(this.state.employees) {
                                                            return this.state.employees.map(emp => {
                                                                return (
                                                                    <FormGroup check key={emp.user._id} className="mb-2">
                                                                        <Label check>
                                                                            <Input onClick={this.handleSelectEmployee} value={emp.user._id} type="checkbox" />{' '}
                                                                            <ProfileImg img={emp.user.profile.img} />
                                                                            {emp.user.profile.first_name} {emp.user.profile.last_name}
                                                                        </Label>
                                                                    </FormGroup>
                                                                )
                                                            })
                                                        }
                                                    })()
                                                }
                                            </Form>
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button disabled={this.state.processing} color="primary" onClick={this.handleSubmit}>{this.state.processing ? 'Please wait...' : 'Create'}</Button>{' '}
                                            <Button disabled={this.state.processing} color="secondary" onClick={this.toggle}>Cancel</Button>
                                        </ModalFooter>
                                    </React.Fragment>
                                )
                            } else {
                                return (
                                    <ModalBody>
                                        <div className="text-center">Loading...</div>
                                    </ModalBody>
                                )
                            }
                        })()
                    }
                </Modal>
            </React.Fragment>
        )
    }

}

export default withRouter(connect()(AssignTask))
