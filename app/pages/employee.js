import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "next/router";
import { Row, Col } from "reactstrap";
import moment from "moment";
import Layout from "../components/layout";
import Loader from "../components/loader";
import Screenshots from "../components/screenshots";
import { logActions } from "../actions";
import { formatLog } from "../helpers";

const EmployeeLogs = props => {

    const [start, setStart] = useState(moment().format("YYYY-MM-DD"));
    const [end, setEnd] = useState(moment().format("YYYY-MM-DD"));

    const handleStartChange = _e => {
        setStart(_e.target.value)
    }

    const handleEndChange = _e => {
        setEnd(_e.target.value)
    }

    useEffect(()=> {
        props.dispatch(logActions.getScreenshots(props.router.query.id, start, end));
    }, [])

    const view = _e => {
        _e.preventDefault();
        props.dispatch(logActions.getScreenshots(props.router.query.id, start, end));
    }

        return (
            <Layout private={true}>
                <Row className="page-content page-screenshots">
                    <Col sm="12" className="text-left">
                        <form onSubmit={view} className="float-right">
                            <div className="form-row align-items-center">
                                <div className="col-auto">
                                    <label>Start</label>
                                    <input type="date" className="form-control mb-2" name="start" placeholder="Start Date" value={start} onChange={handleStartChange} />
                                </div>
                                <div className="col-auto">
                                    <label>End</label>
                                    <input type="date" className="form-control mb-2" name="end" placeholder="End Date" value={end} onChange={handleEndChange} />
                                </div>
                                <div className="col-auto">
                                    <button className="btn btn-primary mt-4">
                                        View
                                    </button>
                                </div>
                            </div>
                        </form>
                    </Col>
                    {(() => {
                        if (props.loading) {
                            return (
                                <Col sm="12" className="text-center">
                                    <Loader />
                                </Col>
                            );
                        } else {
                            if (props.list && props.list.freelancer) {
                                return (
                                    <React.Fragment>
                                        <Col sm="12" lg="12">
                                            <h2>
                                                {props.list.freelancer.profile.first_name} {props.list.freelancer.profile.last_name} - {formatLog(props.list.logs.seconds)}
                                            </h2>
                                        </Col>
                                        <Col sm="12">
                                            <Row className="items">
                                                {(() => {
                                                    if (props.list.logs.screenshots && props.list.logs.screenshots.length > 0) {
                                                        return (
                                                            <Col>
                                                                <Screenshots screenshots={props.list.logs.screenshots} />
                                                            </Col>
                                                        );
                                                    } else {
                                                        <Col sm="12" lg="12" className="text-center">
                                                            No screenshots yet.
                                                        </Col>;
                                                    }
                                                })()}
                                            </Row>
                                        </Col>
                                    </React.Fragment>
                                );
                            }
                        }
                    })()}
                </Row>
            </Layout>
        );
}

function mapStateToProps(state) {
    const { list, loading } = state.request;
    return {
        list,
        loading
    };
}
export default withRouter(connect(mapStateToProps)(EmployeeLogs));
