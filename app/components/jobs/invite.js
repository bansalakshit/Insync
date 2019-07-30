import React from 'react'
import { connect } from 'react-redux'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Form, FormGroup, Label, Input, FormText } from 'reactstrap'

import { jobService } from '../../services'
import { alertActions } from '../../actions'

class InviteFreelancer extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            email: '',
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
        this.setState({
            [name]: value
        })
    }

    handleSubmit(e) {
        e.preventDefault()
        if(!this.state.loading) {
            this.setState({ submitted: true })
            if(this.state.email) {
                this.setState({ loading: true })
                jobService.invite(this.props.jobId, {user: this.state.email})
                    .then(_res => {
                        this.setState({ submitted: false, loading: false, email: '' })
                        this.props.dispatch(alertActions.success(_res.message))
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
                <Button color="primary" onClick={this.toggle}>Invite Employee</Button>
                <Modal backdrop="static" isOpen={this.state.modal}>
                    <ModalHeader>Invite Employee</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.handleSubmit}>
                            <FormGroup>
                                <Label>Email</Label>
                                <Input autoComplete="off" type="email" name="email" value={this.state.email} onChange={this.handleChange} />
                                {this.state.submitted && !this.state.email &&
                                    <FormText color="danger">Email is required</FormText>
                                }
                            </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button disabled={this.state.loading} color="primary" onClick={this.handleSubmit}>{this.state.loading ? 'Please wait...' : 'Send Invitation'}</Button>{' '}
                        <Button disabled={this.state.loading} color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </React.Fragment>
        )
    }

}

export default connect()(InviteFreelancer)
