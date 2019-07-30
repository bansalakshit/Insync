import React from "react";
import { Container, Row, Col, Form, FormGroup, Input, Button } from "reactstrap";

const EarlyAccess = () => {
	return (
        <Container className="features">
            <Row className="m-0">
                <Col sm="12" className="text-center">
                    <h2 className="text-description">Manage Your Employees in 1/3rd the Time</h2>
                </Col>
            </Row>

            <Row className="items">
                <Col xs="12" sm="4">
                    <div className="item">
                        <img src="/static/img/time-task.png" />
                        <div className="caption">Time Tracking per Task</div>
                        <div className="sub-caption">with employee desktop application</div>
                    </div>
                </Col>
                <Col xs="12" sm="4">
                    <div className="item lowered">
                        <img src="/static/img/performance.png" />
                        <div className="caption">Review Performance</div>
                        <div className="sub-caption">and export detailed reports</div>
                    </div>
                </Col>
                <Col xs="12" sm="4">
                    <div className="item">
                        <img src="/static/img/see-everything.png" />
                        <div className="caption">See Everything</div>
                        <div className="sub-caption">with our manager dashboard</div>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default EarlyAccess;
