import React from "react";
import { connect } from "react-redux";

import UserCard from "../common/user/card";
import Settings from "../common/user/settings";

const LoggedInUser = props => {
    return (
        <div className="logged-in-user">
            <UserCard img={props.user ? props.user.profile.img : null} name={props.user ? props.user.profile.first_name : ''} text="Manager" />
            <Settings />
        </div>
    );
};


function mapStateToProps(state) {
    const { user } = state.authentication;
    return {
        user: user
    };
}

export default connect(mapStateToProps)(LoggedInUser);
