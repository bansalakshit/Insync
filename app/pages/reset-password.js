import React from 'react'
import { Button, Form, FormGroup, Label, Input, FormText, Row } from 'reactstrap'
import { connect } from 'react-redux'
import { withRouter } from 'next/router'

import { authActions } from '../actions'

import Layout from '../components/layout'

class ResetPassword extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            password: '',
            confirmPassword: '',
            submitted: false
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentWillMount() {
        this.props.dispatch(authActions.validateResetToken(this.props.router.query.token))
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleSubmit(e) {
        e.preventDefault();

        this.setState({ submitted: true });
        const { password, confirmPassword } = this.state;

        const { dispatch } = this.props;
        if(password && confirmPassword) {
            dispatch(authActions.resetPassword(this.props.router.query.token, password, confirmPassword));
        }
    }

    render() {
        return (
            <Layout>
                <Row className="page-content reset-password">
                    <div className="col-sm-12 col-md-6 offset-md-3 text-center">
                        <h2 className="title">Reset Password</h2>
                    </div>
                    <div className="col-md-6 offset-md-3">
                        <div className="text-center">
                            {   this.props.validating &&
                                    <img alt="" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                            }
                        </div>
                        {
                            (()=>{
                                if(this.props.valid) {
                                    return (
                                        <Form name="form" onSubmit={this.handleSubmit}>
                                            <FormGroup className={(this.state.submitted && !this.state.password ? ' has-error' : '')}>
                                                <Label htmlFor="password">New Password</Label>
                                                <Input type="password" name="password" value={this.state.password} onChange={this.handleChange} />
                                                {this.state.submitted && !this.state.password &&
                                                    <FormText color="danger">Password is required</FormText>
                                                }
                                            </FormGroup>
                                            <FormGroup className={(this.state.submitted && !this.state.password ? ' has-error' : '')}>
                                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                                <Input type="password" name="confirmPassword" value={this.state.confirmPassword} onChange={this.handleChange} />
                                                {this.state.submitted && !this.state.confirmPassword &&
                                                    <FormText color="danger">Confirm Password is required</FormText>
                                                }
                                            </FormGroup>
                                            <FormGroup>
                                                <Button color="primary">Submit</Button>
                                                {this.props.loading &&
                                                    <img alt="" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                                                }
                                            </FormGroup>
                                        </Form>
                                    )
                                }
                            })()
                        }

                    </div>
                </Row>
            </Layout>
        )
    }

}


function mapStateToProps(state) {
    const { loading, error } = state.request
    const { valid, validating } = state.resetPassword
    return {
        loading,
        error,
        valid,
        validating
    }
}

export default withRouter(connect(mapStateToProps)(ResetPassword))