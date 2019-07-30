import React from 'react'
import { connect } from 'react-redux'
import { Row, Col, FormGroup, Input } from 'reactstrap'

import { userJobActions } from '../actions'
import SidebarJobTasksList from './sidebar-job-tasks-list'

class SidebarAssignTasks extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            job: ''
        }
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(_e) {
        const { name, value } = _e.target
        this.setState({
            [name]: value
        })
    }

    get() {
        this.props.dispatch(userJobActions.getUserJobs(this.props.userId))
    }

    componentDidMount() {
        this.get()
    }

    render() {
        return (
            <Row>
                <Col sm="12">
                    {
                        (()=>{
                            if(this.props.user_jobs_loading) {
                                return (
                                    <div className="text-center">Loading...</div>
                                )
                            } else {
                                return (
                                    <React.Fragment>
                                        <FormGroup>
                                            <Input type="select" name="job" onChange={this.handleChange}>
                                                <option value="">Select Job</option>
                                                {
                                                    (()=> {
                                                        return this.props.user_jobs_data.map(job => {
                                                            return (
                                                                <option key={job._id} value={job._id}>{job.title}</option>
                                                            )
                                                        })
                                                    })()
                                                }
                                            </Input>
                                        </FormGroup>
                                        <br/>
                                        {
                                            (()=> {
                                                if(this.state.job.trim() !== '') {
                                                    return (
                                                        <SidebarJobTasksList
                                                            jobId={this.state.job}
                                                            userId={this.props.userId}
                                                        />
                                                    )
                                                }
                                            })()
                                        }
                                    </React.Fragment>
                                )
                            }
                        })()
                    }
                </Col>
            </Row>            
        )
    }

}


function mapStateToProps(state) {
    const { user_jobs_loading, user_jobs_data } = state.user_jobs
    return {
        user_jobs_data,
        user_jobs_loading,
    }
}

export default connect(mapStateToProps)(SidebarAssignTasks)
