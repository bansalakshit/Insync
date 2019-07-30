import React from "react";
import { Row, Col } from "reactstrap";
import { connect } from "react-redux";

import UsersList from "./users-list";
import Header from "./header";
import Timeline from "./timeline";
import ImageDisplay from "./image-display";
import Tasks from "./tasks";
import Chat from "./chat";
import Jobs from "./jobs";
import LoggedInUser from "./logged-in-user";

const LivePage = props => {
    return (
        <Row>
            <Col xs="3" sm="3" className="p-0">
                <LoggedInUser />
                <Jobs />
                <UsersList updateId={props.updateId} job={props.job} />
            </Col>
            <Col xs="9" sm="9" className="p-0">
                {(() => {
                    if (props.user) {
                        return (
                            <React.Fragment>
                                <Row className="m-0">
                                    <Col className="p-0">
                                        <Header userId={props.user._id} name={`${props.user.profile.first_name}`} status={props.user.profile.isOnline} seconds={props.user.today} />
                                        <Timeline />
                                        <ImageDisplay images={(props.user.screenshots && props.user.screenshots[0]) ? props.user.screenshots[0].screenshots : []} />
                                    </Col>
                                </Row>
                                <Row className="m-0">
                                    <Col sm="5" className="p-0">
                                        <Tasks userId={props.user._id} />
                                    </Col>
                                    <Col sm="7" className="p-0">
                                        <Chat jobId={(props.user.screenshots && props.user.screenshots[0]) ? props.user.screenshots[0].job._id : null} userId={props.user._id} />
                                    </Col>
                                </Row>
                            </React.Fragment>
                        );
                    }
                })()}
            </Col>
        </Row>
    );
};

function mapStateToProps(state) {
    const { job, user, updateId } = state.live;
    return { job, user, updateId };
}

export default connect(mapStateToProps)(LivePage);
