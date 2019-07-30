import React from "react";
import { connect } from "react-redux";
import { Row, Col, Table } from "reactstrap";

import { jobActions } from "../../actions";
import Layout from "../../components/layout";

class JobsFreelancer extends React.Component {
    componentDidMount() {
        this.props.dispatch(jobActions.getList("freelancer"));
    }

    render() {
        return (
            <Layout private={true}>
                <Row className="page-content">
                    {(() => {
                        if (this.props.loading) {
                            return (
                                <Col sm="12" className="text-center">
                                    Loading...
                                </Col>
                            );
                        } else {
                            return (
                                <React.Fragment>
                                    <Col sm="12">
                                        <h2>Jobs - as Employee</h2>
                                    </Col>
                                    <Col sm="12">
                                        <Table>
                                            <thead>
                                                <tr>
                                                    <th>Details</th>
                                                    <th>Manager</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(() => {
                                                    if (
                                                        this.props.list &&
                                                        this.props.list.length >
                                                            0
                                                    ) {
                                                        return this.props.list.map(
                                                            job => {
                                                                return (
                                                                    <tr
                                                                        key={
                                                                            job._id
                                                                        }
                                                                    >
                                                                        <td>
                                                                            <div>
                                                                                {
                                                                                    job.title
                                                                                }
                                                                            </div>
                                                                            <div className="text-muted">
                                                                                {
                                                                                    job.description
                                                                                }
                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            {" "}
                                                                            {job.owner &&
                                                                            job
                                                                                .owner
                                                                                .profile
                                                                                ? job
                                                                                      .owner
                                                                                      .profile
                                                                                      .first_name +
                                                                                  " " +
                                                                                  job
                                                                                      .owner
                                                                                      .profile
                                                                                      .last_name
                                                                                : ""}
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            }
                                                        );
                                                    } else {
                                                        return (
                                                            <tr>
                                                                <td
                                                                    colSpan="3"
                                                                    className="text-center"
                                                                >
                                                                    No jobs yet
                                                                </td>
                                                            </tr>
                                                        );
                                                    }
                                                })()}
                                            </tbody>
                                        </Table>
                                    </Col>
                                </React.Fragment>
                            );
                        }
                    })()}
                </Row>
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    const { list, loading } = state.request;
    return {
        list,
        loading
    };
}

export default connect(mapStateToProps)(JobsFreelancer);
