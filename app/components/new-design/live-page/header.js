import React from "react";
import { Row, Col } from "reactstrap";

import OnlineStatus from "../common/user/online-status";
import Menu from "./menu";

import { secondsToHours } from "../../../helpers";

const Header = props => {
    return (
        <Row className="live-page-header m-0">
            <Col sm="6" className="ml-4">
                <div className="user-info">
                    <div className="name">{props.name}</div> <OnlineStatus status={props.status} />
                </div>
                <div className="user-time">
                    <span>Worked {secondsToHours(props.seconds)} hrs today</span>
                </div>
            </Col>
            <Col sm="5">
                <Menu userId={props.userId} />
            </Col>
        </Row>
    )
}

export default Header;