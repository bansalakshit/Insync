import React from 'react'
import Link from 'next/link'
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap'
import { connect } from 'react-redux'

import { authActions } from '../actions'

class Login extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            identity: '',
            password: '',
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
        const { identity, password } = this.state

        const { dispatch } = this.props
        if(identity && password) {
            dispatch(authActions.login(identity, password))
        }
        
    }

    render() {
        return (
            
            <React.Fragment>
                    <div className="col-sm-12 col-md-6 offset-md-3 text-center">
                        <h2 className="title">Login</h2>
                    </div>
                    <div className="col-md-6 offset-md-3">
                        <Form name="form" onSubmit={this.handleSubmit}>
                            <FormGroup className={(this.state.submitted && !this.state.identity ? ' has-error' : '')}>
                                <Label htmlFor="email">Username/Email</Label>
                                <Input type="text" name="identity" value={this.state.identity} onChange={this.handleChange} />
                                {this.state.submitted && !this.state.identity &&
                                    <FormText color="danger">Username/Email is required</FormText>
                                }
                            </FormGroup>
                            <FormGroup className={(this.state.submitted && !this.state.password ? ' has-error' : '')}>
                                <Label htmlFor="password">Password</Label>
                                <Input type="password" className="form-control" name="password" value={this.state.password} onChange={this.handleChange} />
                                {this.state.submitted && !this.state.password &&
                                    <FormText color="danger">Password is required</FormText>
                                }
                            </FormGroup>
                            <FormGroup>
                                <Button color="primary">Sign In</Button>
                                {this.props.loggingIn &&
                                    <img alt="" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                                }
                                <Link href="/register" >
                                    <a className="btn btn-link">Register</a>
                                </Link>
                                <Link href="/forgot-password" >
                                    <a className="btn btn-link">Forgot Password?</a>
                                </Link>
                            </FormGroup>
                        </Form>
                    </div>
            </React.Fragment>
            
        )
    }

}


function mapStateToProps(state) {
    const { loggingIn } = state.authentication
    return {
        loggingIn
    }
}

export default connect(mapStateToProps)(Login)