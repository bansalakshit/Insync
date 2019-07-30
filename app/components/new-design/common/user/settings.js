import React from "react";
import { connect } from "react-redux";
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { authActions } from "../../../../actions";

const Settings = props => {

    const handleLogout = _e => {
       props.dispatch(authActions.logout());
    }

    return (
        <div className="user-settings">
            <UncontrolledDropdown direction="right">
                <DropdownToggle>
                    <img src="/static/img/new-design/settings-work-tool.png" />
                </DropdownToggle>
                <DropdownMenu right>
                    <DropdownItem onClick={handleLogout} className="pointer">Logout</DropdownItem>
                </DropdownMenu>
            </UncontrolledDropdown>
        </div>
    );
};

export default connect()(Settings);
