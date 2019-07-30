import React from "react";
import {
    Container,
    Collapse,
    Navbar,
    NavbarToggler,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Button
} from "reactstrap";
import Link from "next/link";
import Router, { withRouter } from "next/router";
import { connect } from "react-redux";

import { authActions } from "../actions";
import { RESTRICTIONS } from "../helpers";

class Header extends React.Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false
        };
    }

    isAdmin() {
        return this.props.user.roles.some(
            el => RESTRICTIONS.ADMIN.indexOf(el) >= 0
        );
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    goTo(_path) {
        Router.push({
            pathname: _path
        });
    }

    handleLogout(e) {
        const { dispatch } = this.props;
        dispatch(authActions.logout());
    }

    render() {
        return (
            <Container fluid className="header">
                <Container>
                    <Navbar color="light" light expand="md">
                        <div className="navbar-brand">
                            <Link prefetch href="/">
                                <a>
                                    <img src="/static/img/logo.png" />
                                </a>
                            </Link>
                        </div>
                        <NavbarToggler onClick={this.toggle} />
                        <Collapse isOpen={this.state.isOpen} navbar>
                            <Nav className="mr-auto" navbar>
                                {(() => {
                                    if (
                                        this.props.loggedIn &&
                                        this.props.user
                                    ) {
                                        return (
                                            <React.Fragment>
                                                <UncontrolledDropdown nav>
                                                    <DropdownToggle nav caret>
                                                        Jobs
                                                    </DropdownToggle>
                                                    <DropdownMenu right>
                                                        <DropdownItem
                                                            className="pointer"
                                                            onClick={() => {
                                                                this.goTo(
                                                                    "/jobs"
                                                                );
                                                            }}
                                                        >
                                                            As Manager
                                                        </DropdownItem>
                                                        <DropdownItem
                                                            className="pointer"
                                                            onClick={() => {
                                                                this.goTo(
                                                                    "/jobs/freelancer"
                                                                );
                                                            }}
                                                        >
                                                            As Employee
                                                        </DropdownItem>
                                                    </DropdownMenu>
                                                </UncontrolledDropdown>
                                                <NavItem>
                                                    <Link
                                                        href={{
                                                            pathname: "/my-logs"
                                                        }}
                                                    >
                                                        <NavLink>
                                                            My Logs
                                                        </NavLink>
                                                    </Link>
                                                </NavItem>
                                                <NavItem>
                                                    <Link href="/live">
                                                        <NavLink>Live</NavLink>
                                                    </Link>
                                                </NavItem>
                                            </React.Fragment>
                                        );
                                    }
                                })()}
                            </Nav>
                            <Nav className="ml-auto" navbar>
                                {(() => {
                                    if (
                                        this.props.loggedIn &&
                                        this.props.user
                                    ) {
                                        return (
                                            <React.Fragment>
                                                <NavItem>
                                                    <Link
                                                        prefetch
                                                        href="/downloads"
                                                    >
                                                        <NavLink>
                                                            Downloads
                                                        </NavLink>
                                                    </Link>
                                                </NavItem>
                                                <UncontrolledDropdown nav>
                                                    <DropdownToggle nav caret>
                                                        {
                                                            this.props.user
                                                                .profile
                                                                .first_name
                                                        }
                                                    </DropdownToggle>
                                                    <DropdownMenu right>
                                                        <DropdownItem
                                                            className="pointer"
                                                            onClick={() => {
                                                                this.handleLogout();
                                                            }}
                                                        >
                                                            Logout
                                                        </DropdownItem>
                                                    </DropdownMenu>
                                                </UncontrolledDropdown>
                                            </React.Fragment>
                                        );
                                    } else {
                                        return (
                                            <React.Fragment>
                                                <NavItem>
                                                    <Link prefetch href="/">
                                                        <NavLink>Home</NavLink>
                                                    </Link>
                                                </NavItem>
                                                <NavItem>
                                                    <Link prefetch href="/">
                                                        <NavLink>
                                                            Pricing
                                                        </NavLink>
                                                    </Link>
                                                </NavItem>
                                                <NavItem>
                                                    <Link prefetch href="/">
                                                        <NavLink>
                                                            Support
                                                        </NavLink>
                                                    </Link>
                                                </NavItem>
                                                <NavItem>
                                                    <Link
                                                        prefetch
                                                        href="/downloads"
                                                    >
                                                        <NavLink>
                                                            Downloads
                                                        </NavLink>
                                                    </Link>
                                                </NavItem>
                                                <NavItem>
                                                    <Link
                                                        prefetch
                                                        href="/login"
                                                    >
                                                        <Button
                                                            className="btn-sign-in"
                                                            color="primary"
                                                        >
                                                            Sign In
                                                        </Button>
                                                    </Link>
                                                </NavItem>
                                            </React.Fragment>
                                        );
                                    }
                                })()}
                            </Nav>
                        </Collapse>
                    </Navbar>
                </Container>
            </Container>
        );
    }
}

function mapStateToProps(state) {
    const { loggedIn, user } = state.authentication;
    return {
        loggedIn,
        user
    };
}

export default withRouter(connect(mapStateToProps)(Header));
