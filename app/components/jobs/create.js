import React from 'react'
import { connect } from 'react-redux'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Form, FormGroup, Label, Input, FormText } from 'reactstrap'

import { jobService } from '../../services'
import { alertActions, jobActions } from '../../actions'

class CreateJob extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            job: {
                title: '',
                description: ''
            },
            submitted: false,
            loading: false,
            modal: false
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.toggle = this.toggle.bind(this)
    }
  
    toggle() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }))
    }

    handleChange(e) {
        const { name, value } = e.target
        const { job } = this.state
        this.setState({
            job: {
                ...job,
                [name]: value
            }
        })
    }

    handleSubmit(e) {
        e.preventDefault()
        if(!this.state.loading) {
            this.setState({ submitted: true })
            if(this.state.job.title && this.state.job.description) {
                this.setState({ loading: true })
                jobService.create(this.state.job)
                    .then(_res => {
                        this.setState({ submitted: false, loading: false, job: { title: '', description:'' } })
                        this.props.dispatch(alertActions.success(_res.message))
                        if(this.props.cb)
                            this.props.cb()
                    })
                    .catch(_err => {
                        this.setState({ loading: false })
                        this.props.dispatch(alertActions.error(_err))
                    })
            }
        }
    }

    render() {
        return (
            <React.Fragment>
                <Button color="primary" onClick={this.toggle}>New Job</Button>
                <Modal backdrop="static" isOpen={this.state.modal}>
                    <ModalHeader>Job Information</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.handleSubmit}>
                            <FormGroup>
                                <Label>Title</Label>
                                <Input autoComplete="off" type="text" name="title" value={this.state.job.title} onChange={this.handleChange} />
                                {this.state.submitted && !this.state.job.title &&
                                    <FormText color="danger">Title is required</FormText>
                                }
                            </FormGroup>
                            <FormGroup>
                                <Label>Description</Label>
                                <Input autoComplete="off" type="textarea" name="description" value={this.state.job.description} onChange={this.handleChange} />
                                {this.state.submitted && !this.state.job.description &&
                                    <FormText color="danger">Description is required</FormText>
                                }
                            </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button disabled={this.state.loading} color="primary" onClick={this.handleSubmit}>{this.state.loading ? 'Please wait...' : 'Create'}</Button>{' '}
                        <Button disabled={this.state.loading} color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </React.Fragment>
        )
    }

}

export default connect()(CreateJob)
