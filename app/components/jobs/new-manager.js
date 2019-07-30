import React, { useState } from "react";
import { connect } from 'react-redux';
import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Form,
    FormGroup,
    Label,
    Input,
    FormText
} from "reactstrap";

import { jobService } from "../../services";
import { alertActions } from '../../actions'

const NewManager = props => {
    const [email, setEmail] = useState("");
    const [modal, setModal] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const toggle = () => {
        setModal(!modal);
    };

    const handleEmailChange = _e => {
        setEmail(_e.target.value);
    };

    const handleSubmit = _e => {
        _e.preventDefault();
        if(!loading) {
            setSubmitted(true)
            if(email) {
                setLoading(true);
                jobService.newManager(props.jobId, email)
                    .then(_res => {
                        setSubmitted(false);
                        setLoading(false);
                        setEmail('');
                        props.dispatch(alertActions.success(_res.message))
                        if(props.cb)
                            props.cb()
                    })
                    .catch(_err => {
                        setLoading(false);
                        props.dispatch(alertActions.error(_err))
                    })
            }
        }
    };

    return (
        <React.Fragment>
            <Button color="primary" onClick={toggle}>
                New Manager
            </Button>
            <Modal backdrop="static" isOpen={modal}>
                <ModalHeader>Manager Information</ModalHeader>
                <ModalBody>
                    <Form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label>Email</Label>
                            <Input
                                autoComplete="off"
                                type="email"
                                name="email"
                                value={email}
                                onChange={handleEmailChange}
                            />
                            {submitted && !email && (
                                <FormText color="danger">
                                    Email is required
                                </FormText>
                            )}
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button
                        disabled={loading}
                        color="primary"
                        onClick={handleSubmit}
                    >
                        {loading ? "Please wait..." : "Create"}
                    </Button>{" "}
                    <Button
                        disabled={loading}
                        color="secondary"
                        onClick={toggle}
                    >
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        </React.Fragment>
    );
};

export default connect()(NewManager);
