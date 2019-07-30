import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { FormGroup, Input } from "reactstrap";

import { jobActions, liveActions } from "../../../actions";

const Jobs = props => {
    const [job, setJob] = useState(job);

    const handleJobChange = _e => {
        setJob(_e.target.value);
        props.dispatch(liveActions.changeJob(_e.target.value));
    };

    useEffect(() => {
        props.dispatch(jobActions.getJobs());
    }, []);

    return (
        <div className="jobs-list">
            <FormGroup>
                <Input onChange={handleJobChange} value={job} type="select" name="job">
                    <option value="all">All Jobs</option>
                    {(() => {
                        if (props.jobs_data) {
                            return props.jobs_data.map(_job => {
                                return (
                                    <option key={_job._id} value={_job._id}>
                                        {_job.title}
                                    </option>
                                );
                            });
                        }
                    })()}
                </Input>
            </FormGroup>
        </div>
    );
};

function mapStateToProps(state) {
    const { jobs_data, jobs_loading } = state.jobs;
    return { jobs_data, jobs_loading };
}

export default connect(mapStateToProps)(Jobs);
