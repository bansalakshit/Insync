import React from "react";
import { Row, Col, Card, CardTitle, CardText, Button } from "reactstrap";
import Layout from "../components/layout";

const Downloads = props => {
	return (
        <Layout>
            <Row className="page-content download-page">
                <Col sm="12">
                    <h2>InSync Team Desktop Application</h2>
                </Col>
                <Col xs="12" sm="6" lg="4">
                    <Card body inverse color="primary">
                        <CardTitle>MacOS</CardTitle>
                        <CardText>Download InSync Desktop App for MacOS</CardText>
                        <a className="btn btn-secondary" target="_blank" href="https://drive.google.com/open?id=1FPMSIFdU20K2t1Nm1hSIriQQCqCvI3Y3" >Download</a>
                    </Card>
                    <br />
                </Col>
                <Col xs="12" sm="6" lg="4">
                    <Card body inverse color="primary">
                        <CardTitle>Linux</CardTitle>
                        <CardText>Download InSync Desktop App for Linux</CardText>
                        <a className="btn btn-secondary" target="_blank" href="https://drive.google.com/open?id=1oGdYwyIHTRcEGaIzGdL4ajoPjxCeXtkd" >Download</a>
                    </Card>
                    <br />
                </Col>
                <Col xs="12" sm="6" lg="4">
                    <Card body inverse color="primary">
                        <CardTitle>Windows</CardTitle>
                        <CardText>Download InSync Desktop App for Windows</CardText>
                        <a className="btn btn-secondary" target="_blank" href="https://drive.google.com/open?id=1h-dHzknKo50bmEmqfEuL-DRLxlm-dFNB" >Download</a>
                    </Card>
                    <br />
                </Col>
            </Row>
        </Layout>
	);
};

export default Downloads;
