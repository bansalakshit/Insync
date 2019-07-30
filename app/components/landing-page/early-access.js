import React, { useState } from "react";
import { Container, Row, Col, Form, FormGroup, Input, Button } from "reactstrap";
import { withRouter } from 'next/router'
import { connect } from "react-redux";

import { subscriptionService } from '../../services'
import { alertActions } from '../../actions'

const EarlyAccess = (props) => {
    
    const referrer = props.router.query.r
    
    const [email, setEmail] = useState('')
    const [isLoading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        setSubmitted(true)
        if(isLoading === false && submitted === false) {
            setLoading(true)
            subscriptionService.subscribe(email, referrer)
                .then(_res => {
                    if(_res.waitlistUrl) {
                        window.location.href = _res.waitlistUrl
                    } else {
                        props.dispatch(alertActions.success(_res.message))
                        setEmail('')
                        setLoading(false)
                        setSubmitted(false)
                    }
                })
                .catch(_err => {
                    props.dispatch(alertActions.error(_err))
                    setLoading(false)
                    setSubmitted(false)
                })
        }
    }
    
	return (
        <Container fluid className="early-access">
            <Row className="m-0">
                <Col sm="12" className="text-center">
                    <h2 className="text-banner">Take the work out of managing a team</h2>
                </Col>
            </Row>
            <Row className="m-0">
                <Col sm="10" md="8" lg="6" className="offset-sm-1 offset-md-2 offset-lg-3">
                    <Form onSubmit={handleSubmit} className="subscription-form">
                        <Row form>
                            <Col xs="12" sm="7" md="7">
                                <FormGroup>
                                    <Input value={email} onChange={e=>setEmail(e.target.value)} autoComplete="off" type="email" name="email" placeholder="Your email address" />
                                </FormGroup>
                            </Col>
                            <Col xs="12" sm="5" md="5">
                                <FormGroup className="text-center">
                                    <Button disabled={isLoading} color="primary">{isLoading ? 'Processing...' : 'Get Early Access'}</Button>
                                </FormGroup>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}

export default withRouter(connect()(EarlyAccess))
