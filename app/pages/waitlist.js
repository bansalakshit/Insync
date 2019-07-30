import React from 'react'
import { connect } from "react-redux";
import { withRouter } from 'next/router'
import { Row, Col, Alert } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

import Layout from '../components/layout'
import WaitlistAccount from '../components/waitlist-account'
import { subscriptionService } from '../services'
import { alertActions } from '../actions'

class Waitlist extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isActivate: false,
            hasError: false,
            error: '',
            message: '',
            loaded: false,
            isProcessing: false
        }
    }

    componentDidMount() {
        this.setState({loaded: true})
        if(this.props.router.query.token) {
            this.setState({isActivate: true, isProcessing: true})
            subscriptionService.activate(this.props.router.query.token)
                .then(_res => {
                    this.props.dispatch(alertActions.success(_res.message))
                    this.setState({isProcessing: false, hasError: false, message: _res.message})
                    window.location.href = _res.waitlistUrl
                })
                .catch(_err => {
                    this.setState({isProcessing: false, hasError: true, error: _err})
                })
        }
    }

    render() {
        return (
            <Layout>
                {
                    (()=>{
                        if(this.state.loaded) {
                            return (
                                <Row className="page-content">
                                    {
                                        (()=>{
                                            if(this.state.isProcessing) {
                                                return (
                                                    <Col className="text-center">
                                                        <FontAwesomeIcon className="fa-spin" icon={faSpinner}/>
                                                    </Col>
                                                )
                                            } else {
                                                if(this.state.hasError) {
                                                    return (
                                                        <Col className="text-center">
                                                            <Alert color="danger">{this.state.error}</Alert>
                                                        </Col>
                                                    )
                                                } else {
                                                    if(this.props.router.query.id)
                                                        return (
                                                            <Col sm="12">
                                                                <WaitlistAccount 
                                                                    refId={this.props.router.query.id}
                                                                />
                                                            </Col>
                                                        )
                                                }
                                            }
                                        })()
                                    }
                                </Row>
                            )
                        }
                    })()
                }
            </Layout>
        )
    }

}

export default withRouter(connect()(Waitlist))
