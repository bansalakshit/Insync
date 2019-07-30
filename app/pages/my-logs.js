import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Row, Col } from "reactstrap";
import moment from "moment";
import array from "lodash/array";
import { alertActions } from "../actions";
import { logService, jobService } from "../services";
import Layout from "../components/layout";
import Loader from "../components/loader";
import Screenshots from "../components/screenshots";
import { formatLog } from "../helpers";

const MyLogs = props => {
    const [start, setStart] = useState(moment().format("YYYY-MM-DD"));
    const [end, setEnd] = useState(moment().format("YYYY-MM-DD"));
    const [job, setJob] = useState("all");
    const [employeer, setEmployeer] = useState("all");
    const [logs, setLogs] = useState(null);
    const [processing, setProcessing] = useState(false);

    const [employeers, setEmployeers] = useState(null);
    const [jobs, setJobs] = useState(null);
    const [loading, setLoading] = useState(true);

    const [result, setResult] = useState(null);

    useEffect(() => {
        jobService
            .freelancer()
            .then(_jobs => {
                setResult(_jobs);
                let owners = array.uniqBy(_jobs.map(_job => _job.owner), "_id");
                setEmployeers(owners);
                setLoading(false);
            })
            .catch(_err => {
                props.dispatch(alertActions.error(_err));
                setLoading(false);
            });
    }, []);

    const handleStartChange = _e => {
        setStart(_e.target.value);
    };

    const handleEndChange = _e => {
        setEnd(_e.target.value);
    };

    const handleJobChange = _e => {
        setJob(_e.target.value);
    };

    const handleEmployeerChange = _e => {
        setEmployeer(_e.target.value);
        if (_e.target.value == "all") {
            setJob("all");
            setJobs(null)
        } else {
            setJob("all");
            let tempJobs = result.filter(_res => _res.owner._id === _e.target.value);
            setJobs(tempJobs);
        }
    };

    const view = _e => {
        _e.preventDefault();
        if (!processing) {
            setProcessing(true);
            logService
                .myScreenshots(employeer, job, start, end)
                .then(_logs => {
                    console.log(_logs)
                    setLogs(_logs);
                    setProcessing(false);
                })
                .catch(_err => {
                    props.dispatch(alertActions.error(_err));
                    setProcessing(false);
                });
        }
    };

    return (
        <Layout private={true}>
            <Row className="page-content page-screenshots">
                {(() => {
                    if (loading) {
                        return <Loader />;
                    } else {
                        return (
                            <React.Fragment>
                                <Col sm="12" className="text-left">
                                    <form onSubmit={view} className="float-right">
                                        <div className="form-row align-items-center">
                                            <div className="col-auto">
                                                <label>Employeer</label>
                                                <select onChange={handleEmployeerChange} name="job" value={employeer} className="form-control mb-2">
                                                    <option value="all">All</option>
                                                    {(() => {
                                                        if (employeers && employeers.length > 0) {
                                                            return employeers.map(_employeer => {
                                                                return (
                                                                    <option key={_employeer._id} value={_employeer._id}>
                                                                        {_employeer.profile.first_name} {_employeer.profile.last_name}
                                                                    </option>
                                                                );
                                                            });
                                                        }
                                                    })()}
                                                </select>
                                            </div>
                                            {(() => {
                                                if (jobs && jobs.length > 0) {
                                                    return (
                                                        <div className="col-auto">
                                                            <label>Job</label>
                                                            <select onChange={handleJobChange} name="job" value={job} className="form-control mb-2">
                                                                <option value="all">All</option>
                                                                {(() => {
                                                                    if (jobs && jobs.length > 0) {
                                                                        return jobs.map(job => {
                                                                            return (
                                                                                <option key={job._id} value={job._id}>
                                                                                    {job.title} - ({job.owner.profile.first_name} {job.owner.profile.last_name})
                                                                                </option>
                                                                            );
                                                                        });
                                                                    }
                                                                })()}
                                                            </select>
                                                        </div>
                                                    );
                                                }
                                            })()}
                                            <div className="col-auto">
                                                <label>Start</label>
                                                <input type="date" className="form-control mb-2" name="start" placeholder="Start Date" value={start} onChange={handleStartChange} />
                                            </div>
                                            <div className="col-auto">
                                                <label>End</label>
                                                <input type="date" className="form-control mb-2" name="end" placeholder="End Date" value={end} onChange={handleEndChange} />
                                            </div>
                                            <div className="col-auto">
                                                <button className="btn btn-primary mt-4">View</button>
                                            </div>
                                        </div>
                                    </form>
                                </Col>
                                <Col sm="12">
                                    <br />
                                    {(() => {
                                        if (processing) {
                                            return <Loader />;
                                        } else if (logs) {
                                            return (
                                                <React.Fragment>
                                                    <h2>{formatLog(logs.seconds)}</h2>
                                                    <Screenshots screenshots={logs.screenshots} />
                                                </React.Fragment>
                                            )
                                        }
                                    })()}
                                </Col>
                            </React.Fragment>
                        );
                    }
                })()}
            </Row>
        </Layout>
    );
};

export default connect()(MyLogs);
