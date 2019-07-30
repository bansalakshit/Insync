import React from "react";
import { connect } from "react-redux";
import { withRouter } from "next/router";
import { Row, Col, Alert, TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import classnames from 'classnames'

import { subscriptionService } from "../services";
import Referrals from './referrals'

class WaitlistAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: false,
            hasError: false,
            error: "",
            loaded: false,
            isProcessing: false,
            activeTab: 'list'
        };
        this.toggle = this.toggle.bind(this);
    }

    toggle(_tab) {
        if (this.state.activeTab !== _tab) {
            this.setState({
                activeTab: _tab
            });
        }
    }

    componentDidMount() {
        this.setState({
            loaded: true
        });
        if (this.props.refId) {
            this.setState({
                isProcessing: true
            });
            subscriptionService
                .account(this.props.refId)
                .then(_res => {
                    this.setState({
                        isProcessing: false,
                        hasError: false,
                        data: _res.data
                    });
                })
                .catch(_err => {
                    this.setState({
                        isProcessing: false,
                        hasError: true,
                        error: _err
                    });
                });
        }
    }

    render() {
        return (
            <Row>
                {(() => {
                    if (this.state.loaded) {
                        if (this.state.isProcessing) {
                            return (
                                <Col className="text-center">
                                    <FontAwesomeIcon
                                        className="fa-spin"
                                        icon={faSpinner}
                                    />
                                </Col>
                            );
                        } else {
                            if (this.state.hasError) {
                                return (
                                    <Col className="text-center">
                                        <Alert color="danger">
                                            {" "}
                                            {this.state.error}{" "}
                                        </Alert>
                                    </Col>
                                );
                            } else {
                                return (
                                    <Col>
                                        <Row>
                                            <Col sm="6">
                                                <div>
                                                    Email: {this.state.data.info.email}
                                                </div>
                                                <div>
                                                    Referral URL:{" "}
                                                    {this.state.data.referralUrl}
                                                </div>
                                            </Col>
                                            <Col sm="6">
                                                <Nav tabs>
                                                    <NavItem>
                                                        <NavLink
                                                        className={classnames('pointer', {active: this.state.activeTab === 'list' })}
                                                        onClick={() => { this.toggle('list'); }}
                                                        >
                                                        Referrals
                                                        </NavLink>
                                                    </NavItem>
                                                    <NavItem>
                                                        <NavLink
                                                        className={classnames('pointer', {active: this.state.activeTab === 'invite' })}
                                                        onClick={() => { this.toggle('invite'); }}
                                                        >
                                                        Invite
                                                        </NavLink>
                                                    </NavItem>
                                                </Nav>
                                                <TabContent activeTab={this.state.activeTab}>
                                                    <TabPane tabId="list">
                                                        <Row>
                                                            <Col sm="12">
                                                                <br />
                                                                <Referrals 
                                                                    list={this.state.data.referrals}
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </TabPane>
                                                    <TabPane tabId="invite">
                                                        <Row>
                                                            <Col sm="12">
                                                                <br />
                                                                <h1>Invite</h1>
                                                            </Col>
                                                        </Row>
                                                    </TabPane>
                                                </TabContent>
                                            </Col>
                                        </Row>
                                    </Col>
                                );
                            }
                        }
                    }
                })()}
            </Row>
        );
    }
}

export default withRouter(connect()(WaitlistAccount));
