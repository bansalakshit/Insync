import React from 'react'
import { connect } from 'react-redux'
import { Button, Form, FormGroup, Label, Input, FormText, Row, Col } from 'reactstrap'

import Layout from '../components/layout'
import { authActions } from '../actions'

class Register extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            user: {
                first_name: '',
                last_name: '',
                username: '',
                confirmPassword: '',
                email: '',
                password: '',
            },
            submitted: false
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(e) {
        const { name, value } = e.target
        const { user } = this.state
        this.setState({
            user: {
                ...user,
                [name]: value
            }
        })
    }

    handleSubmit(e) {
        e.preventDefault()

        this.setState({ submitted: true })
        const { user } = this.state
        const { dispatch } = this.props
        if (user.first_name && user.last_name && user.email && user.password && user.confirmPassword) {
            dispatch(authActions.register(user))
        }
    }

    render() {
        return (
            <Layout>
                <Row className="row page-content register">
                    <div className="col-sm-12 col-md-6 offset-md-3 text-center">
                        <h2 className="title">Register</h2>
                    </div>
                    <div className="col-sm-12 col-md-6 offset-md-3">
                        <Form name="form" onSubmit={this.handleSubmit}>
                            <Row>
                                <Col sm="12">
                                    <FormGroup className={(this.state.submitted && !this.state.user.first_name ? 'has-error' : '')}>
                                        <Label htmlFor="first_name">First Name</Label>
                                        <Input autoComplete="off" type="text" name="first_name" value={this.state.user.first_name} onChange={this.handleChange} />
                                        {this.state.submitted && !this.state.user.first_name &&
                                            <FormText color="danger">First Name is required</FormText>
                                        }
                                    </FormGroup>
                                    <FormGroup className={(this.state.submitted && !this.state.user.last_name ? 'has-error' : '')}>
                                        <Label htmlFor="last_name">Last Name</Label>
                                        <Input autoComplete="off" type="text" name="last_name" value={this.state.user.last_name} onChange={this.handleChange} />
                                        {this.state.submitted && !this.state.user.last_name &&
                                            <FormText color="danger">Last Name is required</FormText>
                                        }
                                    </FormGroup>
                                    <FormGroup className={(this.state.submitted && !this.state.user.username ? 'has-error' : '')}>
                                        <Label htmlFor="username">Username</Label>
                                        <Input autoComplete="off" className="transparent" placeholder="Username" type="text" name="username" value={this.state.user.username} onChange={this.handleChange} />
                                        {this.state.submitted && !this.state.user.username &&
                                            <FormText color="danger">Username is required</FormText>
                                        }
                                    </FormGroup>
                                    <FormGroup className={(this.state.submitted && !this.state.user.email ? 'has-error' : '')}>
                                        <Label htmlFor="email">Email</Label>
                                        <Input autoComplete="off" type="email" name="email" value={this.state.user.email} onChange={this.handleChange} />
                                        {this.state.submitted && !this.state.user.email &&
                                            <FormText color="danger">Email is required</FormText>
                                        }
                                    </FormGroup>
                                    <FormGroup className={(this.state.submitted && !this.state.user.password ? 'has-error' : '')}>
                                        <Label htmlFor="password">Password</Label>
                                        <Input autoComplete="off" type="password" name="password" value={this.state.user.password} onChange={this.handleChange} />
                                        {this.state.submitted && !this.state.user.password &&
                                            <FormText color="danger">Password is required</FormText>
                                        }
                                    </FormGroup>
                                    <FormGroup className={(this.state.submitted && !this.state.user.password ? 'has-error' : '')}>
                                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                                        <Input autoComplete="off" type="password" name="confirmPassword" value={this.state.user.confirmPassword} onChange={this.handleChange} />
                                        {this.state.submitted && !this.state.user.confirmPassword &&
                                            <FormText color="danger">Confirmat Password is required</FormText>
                                        }
                                    </FormGroup>
                                </Col>
                            </Row>
                            <FormGroup>
                                <Button color="primary">Register</Button>
                                {this.props.registering &&
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
    const { registering } = state.registration
    return {
        registering
    }
}

export default connect(mapStateToProps)(Register)