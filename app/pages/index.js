import React, { useEffect } from "react";
import { connect } from "react-redux";
import Router from "next/router";

import LandingPage from "../components/landing-page/index";

const IndexPage = props => {
    useEffect(() => {
        if (props.loggedIn) {
            Router.push({
                pathname: "/dashboard"
            });
        }
    }, []);

    return <LandingPage />;
};

function mapStateToProps(state) {
    const { loggedIn } = state.authentication;
    return {
        loggedIn
    };
}

export default connect(mapStateToProps)(IndexPage);
