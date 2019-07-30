import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'next/router'
import { Navbar, NavbarBrand, NavbarToggler, Collapse, Nav, NavItem, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'

import { authActions } from '../actions'
import { appConfig } from '../config'

class Header extends React.Component {

    constructor(props) {
        super(props)
    
        this.toggle = this.toggle.bind(this)
        this.handleLogout = this.handleLogout.bind(this)

        this.state = {
            isOpen: false
        }
    }

    handleLogout() {
        const {
            dispatch
        } = this.props;
        dispatch(authActions.logout())
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        })
    }

    render() {
        return (
                <Navbar color="light" light expand="md">
                    <NavbarBrand>
                        <img src="/static/img/logo.png"/> <span className="app-version">v{appConfig.version}</span>
                    </NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                                {
                                    (()=>{
                                        if(this.props.loggedIn && this.props.user){
                                            if(this.props.tracking) {
                                                return (
                                                    <Nav className="ml-auto" navbar>
                                                        <NavItem>{this.props.user.profile.first_name}</NavItem>
                                                    </Nav>
                                                )
                                            } else {
                                                return (
                                                        <Nav className="ml-auto" navbar>
                                                            <UncontrolledDropdown nav inNavbar>
                                                                <DropdownToggle nav caret>
                                                                    {this.props.user.profile.first_name}
                                                                </DropdownToggle>
                                                                <DropdownMenu right>
                                                                    <DropdownItem className="pointer" onClick={()=>{
                                                                            this.handleLogout()
                                                                        }} >
                                                                        Logout
                                                                    </DropdownItem>
                                                                </DropdownMenu>
                                                            </UncontrolledDropdown>
                                                        </Nav>
                                                )
                                            }
                                        }
                                    })()
                                }
                    </Collapse>
                </Navbar>
        )
    }

}


function mapStateToProps(state) {
    const {
        loggedIn,
        user
    } = state.authentication
    const { tracking } = state.tracker
    return {
        loggedIn,
        user,
        tracking
    }
}

export default withRouter(connect(mapStateToProps)(Header))


