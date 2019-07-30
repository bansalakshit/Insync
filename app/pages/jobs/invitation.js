import React from 'react'
import { connect } from 'react-redux'
import { Row, Col, Alert } from 'reactstrap'
import { withRouter } from 'next/router'

import { jobActions } from '../../actions'
import Layout from '../../components/layout'

class Invitation extends React.Component {

    componentDidMount() {
        this.props.dispatch(jobActions.acceptInvitation(this.props.router.query.token))
    }

    render() {
        return (
            <Layout>
                <Row>
                    <Col sm="12" className="page-content">
                        {
                            (()=> {
                                if(this.props.loading) {
                                    return (
                                        <div className="text-center">Loading...</div>
                                    )
                                } else {
                                    if(this.props.list) {
                                        return (
                                            <React.Fragment>
                                                <Alert color="success">Job invitation was accepted successfully</Alert>
                                                {
                                                    (()=> {
                                                        if(!this.props.list.isRegistered) {
                                                            return (
                                                                <Alert color="danger">Please sign up to start working.</Alert>
                                                            )
                                                        }
                                                    })()
                                                }
                                            </React.Fragment>
                                        )
                                    }
                                }
                            })()
                        }
                    </Col>
                </Row>
            </Layout>
        )
    }

}

function mapStateToProps(state) {
    const { list, loading } = state.request
    return {
        list,
        loading
    }
}

export default withRouter(connect(mapStateToProps)(Invitation))