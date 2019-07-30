import React, { useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import { connect } from "react-redux";
import { withRouter } from "next/router";

import Head from "./common/head";
import Sidebar from "./common/sidebar";

const Layout = props => {
    const { children } = props;

    useEffect(() => {
        if (props.private && !props.loggedIn) localStorage.setItem("redirect", props.router.asPath);
    });

    return (
        <React.Fragment>
            <Head />
            <Container fluid className="new-layout">
                <Row>
                    <Col xs="2" sm="1">
                        <Sidebar />
                    </Col>
                    <Col xs="10" sm="11">
                        {children}
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    );
};

function mapStateToProps(state) {
    const { loggedIn } = state.authentication;
    return {
        loggedIn: loggedIn
    };
}

export default withRouter(connect(mapStateToProps)(Layout));
