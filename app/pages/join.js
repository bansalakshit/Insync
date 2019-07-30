import React from 'react'
import { connect } from 'react-redux'
import { Row, Col, Alert } from 'reactstrap'
import { withRouter } from 'next/router'

import { jobActions } from '../actions'
import Layout from '../components/layout'

class Join extends React.Component {

    componentDidMount() {
        this.props.dispatch(jobActions.join(this.props.router.query.j, this.props.router.asPath))
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
                                    if(this.props.error) {
                                        return (
                                            <Alert color="danger">
                                                An error occurred, please make sure you are logged in and you didn't already join this job.
                                            </Alert>
                                        )
                                    } else {
                                        return (
                                            <Alert color="success">{this.props.list.message}</Alert>
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
    const { list, loading, error } = state.request
    return {
        list,
        loading,
        error
    }
}

export default withRouter(connect(mapStateToProps)(Join))