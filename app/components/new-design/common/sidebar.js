import React from "react";
import { Row, Col } from "reactstrap";
import Link from "next/link";

const Sidebar = props => {
    return (
        <Row className="sidebar">
            <Col sm="12" className="p-0 menu">
                <div className="logo item">
                    <Link href="/"><img src="/static/img/new-design/logo.png" /></Link>
                </div>
                <div className="item active">
                    <img src="/static/img/new-design/monitor.png" />
                </div>
                <div className="item">
                    <img src="/static/img/new-design/statistics.png" />
                </div>
                <div className="item">
                    <img src="/static/img/new-design/resume.png" />
                </div>
            </Col>
        </Row>
    );
};

export default Sidebar;
