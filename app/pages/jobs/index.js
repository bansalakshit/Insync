import React from 'react'
import Link from 'next/link'
import { connect } from 'react-redux'
import { Row, Col, Table } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import { jobActions } from '../../actions'
import { jobService } from '../../services'
import Layout from '../../components/layout'
import CreateJob from '../../components/jobs/create'
import InviteLink from '../../components/jobs/invite-link'
import NewManager from '../../components/jobs/new-manager'

class Jobs extends React.Component {

    constructor(props) {
        super(props)
        this.get = this.get.bind(this)
        this.archive = this.archive.bind(this)
    }

    archive(_jobId, _userId) {
        jobService.archiveFreelancer(_jobId, _userId)
            .then(_res => {
                this.get()
            })
    }

    remove(_jobId, _userId) {
        jobService.removeManager(_jobId, _userId)
            .then(_res => {
                this.get()
            })
    }

    componentDidMount() {
        this.get()
    }

    get() {
        this.props.dispatch(jobActions.getList('list'))
    }

    render() {
        return (
            <Layout private={true}>
                <Row className="page-content">
                    {
                        (()=> {
                            if(this.props.loading) {
                                return (
                                    <Col sm="12" className="text-center">Loading...</Col>
                                )
                            } else {
                                return (
                                    <React.Fragment>
                                        <Col sm="12" lg="6">
                                            <h2>Jobs - as Manager</h2>
                                        </Col>
                                        <Col sm="12" lg="6" className="text-right">
                                            <CreateJob 
                                                cb={this.get}
                                            />
                                        </Col>
                                        <Col sm="12">
                                            <Table>
                                                <thead>
                                                    <tr>
                                                        <th>Details</th>
                                                        <th>Tasks</th>
                                                        <th>Employees</th>
                                                        <th>Managers</th>
                                                        <th>Invitation Link</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                {
                                                    (() => {
                                                        if(this.props.list && this.props.list.length > 0) {
                                                            return this.props.list.map(job => {
                                                                return (
                                                                    <tr key={job._id}>
                                                                        <td>
                                                                            <div>{job.title}</div>
                                                                            <div className="text-muted">{job.description}</div>
                                                                        </td>
                                                                        <td>
                                                                            <Link href={{ pathname: '/jobs/tasks', query: { id: job._id }}}>
                                                                                <a>View Tasks</a>
                                                                            </Link>
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                (()=>{
                                                                                    if(job.freelancers && job.freelancers.length > 0) {
                                                                                        return job.freelancers.map(freelancer => {
                                                                                            if(freelancer.user)
                                                                                                return (
                                                                                                    <div className={freelancer.active ? '': 'line-through'} key={freelancer._id}>
                                                                                                        {freelancer.user.profile.first_name} {freelancer.user.profile.last_name}
                                                                                                        {
                                                                                                            (()=>{
                                                                                                                if(freelancer.active) {
                                                                                                                    return (
                                                                                                                        <span onClick={()=>{this.archive(job._id, freelancer.user._id)}} style={{marginLeft: '15px'}} className="pointer text-danger"><FontAwesomeIcon icon={faTimes}/> </span>
                                                                                                                    )
                                                                                                                }
                                                                                                            })()
                                                                                                        }
                                                                                                    </div>
                                                                                                )
                                                                                        })
                                                                                    }
                                                                                })()
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                (()=>{
                                                                                    if(job.managers && job.managers.length > 0) {
                                                                                        return job.managers.map(manager => {
                                                                                            if(manager.user)
                                                                                                return (
                                                                                                    <div className={manager.active ? '': 'line-through'} key={manager._id}>
                                                                                                        {manager.user.profile.first_name} {manager.user.profile.last_name}
                                                                                                        {
                                                                                                            (()=>{
                                                                                                                if(manager.active) {
                                                                                                                    return (
                                                                                                                        <span onClick={()=>{this.remove(job._id, manager.user._id)}} style={{marginLeft: '15px'}} className="pointer text-danger"><FontAwesomeIcon icon={faTimes}/> </span>
                                                                                                                    )
                                                                                                                }
                                                                                                            })()
                                                                                                        }
                                                                                                    </div>
                                                                                                )
                                                                                        })
                                                                                    }
                                                                                })()
                                                                            }
                                                                            <NewManager
                                                                                cb={this.get}
                                                                                jobId={job._id}
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <InviteLink 
                                                                                jobId={job._id}
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })
                                                        } else {
                                                            return (
                                                                <tr>
                                                                    <td colSpan="4" className="text-center">No jobs yet</td>
                                                                </tr>
                                                            )
                                                        }
                                                    })()
                                                }
                                                </tbody>
                                            </Table>
                                        </Col>
                                    </React.Fragment>
                                )
                            }
                        })()
                    }
                </Row>
            </Layout>
        )
    }
}


function mapStateToProps(state) {
    const { list, loading } = state.request
    return {
        list,
        loading
    }
}

export default connect(mapStateToProps)(Jobs)
