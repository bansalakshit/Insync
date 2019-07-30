import React from 'react'
import { Button, Form, FormGroup, Label, Input, FormText, Row } from 'reactstrap'
import { connect } from 'react-redux'
import { authActions } from '../actions'
import Layout from '../components/layout'

class ForgotPassword extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            email: '',
            submitted: false
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(e) {
        const { name, value } = e.target
        this.setState({ [name]: value })
    }

    handleSubmit(e) {
        e.preventDefault()

        this.setState({ submitted: true })
        const { email } = this.state

        const { dispatch } = this.props
        if(email) {
            dispatch(authActions.forgotPassword(email))
        }
    }

    render() {
        return (
            <Layout>
                <Row className="page-content forgot-password">
                    <div className="col-sm-12 col-md-6 offset-md-3 text-center">
                        <h2 className="title">Forgot Password</h2>
                    </div>
                    <div className="col-md-6 offset-md-3">
                        <Form name="form" onSubmit={this.handleSubmit}>
                            <FormGroup className={(this.state.submitted && !this.state.email ? ' has-error' : '')}>
                                <Label htmlFor="email">Email</Label>
                                <Input type="email" name="email" value={this.state.email} onChange={this.handleChange} />
                                {this.state.submitted && !this.state.email &&
                                    <FormText color="danger">Email is required</FormText>
                                }
                            </FormGroup>
                            <FormGroup>
                                <Button color="primary">Submit</Button>
                                {this.props.loading &&
                                    <img alt="" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                                }
                            </FormGroup>
                        </Form>
                    </div>
                </Row>
            </Layout>
        )
    }

}


function mapStateToProps(state) {
    const { loading, error } = state.request
    return {
        loading,
        error
    }
}

export default connect(mapStateToProps)(ForgotPassword)