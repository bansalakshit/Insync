import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'

import { Row, Col, Table } from 'reactstrap'

import Layout from '../../components/layout'
import CreateTask from '../../components/jobs/create-task'
import RemoveTask from '../../components/jobs/remove-task'
import AssignTask from '../../components/jobs/assign-task'
import UpdateTask from '../../components/jobs/update-task'
import { jobActions } from '../../actions'

class Tasks extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            loaded: false
        }

    }

    componentDidMount() {
        this.props.dispatch(jobActions.getTasks(this.props.router.query.id))
    }

    get() {
        this.props.dispatch(jobActions.getTasks(this.props.router.query.id, false))
    }

    render() {
        return (
            <Layout>
                <Row className="page-content">
                    {
                        (()=> {
                            if(this.props.loading && !this.state.loaded) {
                                return (
                                    <Col sm="12" className="text-center">Loading...</Col>
                                )
                            } else {
                                if(this.props.list)
                                    return (
                                        <React.Fragment>
                                            <Col sm="12" lg="6">
                                                <h2>
                                                    {this.props.list.job ? this.props.list.job.title : ''} - Tasks List
                                                </h2>
                                            </Col>
                                            <Col sm="12" lg="6" className="text-right">
                                                <CreateTask 
                                                    jobId={this.props.list.job ? this.props.list.job._id : null}
                                                    callback={()=>{this.get()}}
                                                />
                                            </Col>
                                            <Col sm="12">
                                                <Table>
                                                    <thead>
                                                        <tr>
                                                            <th>Description</th>
                                                            <th>
                                                                Assignee(s)
                                                            </th>
                                                            <th>
                                                                Priority
                                                            </th>
                                                            <th></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                    {
                                                        (() => {
                                                            if(this.props.list && this.props.list.tasks && this.props.list.tasks.length > 0) {
                                                                return this.props.list.tasks.map(task => {
                                                                    return (
                                                                        <tr key={task._id}>
                                                                            <td>
                                                                                <UpdateTask
                                                                                    taskId={task ? task._id : null}
                                                                                    value={task.description}
                                                                                    field="description"
                                                                                    callback={()=>{this.get()}}
                                                                                />
                                                                                {
                                                                                    (()=>{
                                                                                        if(task.link) {
                                                                                            return (
                                                                                                <UpdateTask
                                                                                                    taskId={task ? task._id : null}
                                                                                                    value={task.link}
                                                                                                    field="link"
                                                                                                    callback={()=>{this.get()}}
                                                                                                />
                                                                                            )
                                                                                        }
                                                                                    })()
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    (()=>{
                                                                                        if(task.freelancers && task.freelancers.length > 0) {
                                                                                            return task.freelancers.map(freelancer => {
                                                                                                if(freelancer.user)
                                                                                                    return (
                                                                                                        <div className={freelancer.active ? '': 'line-through'} key={freelancer._id}>
                                                                                                            {
                                                                                                                (()=>{
                                                                                                                    if(freelancer.status === 'completed') {
                                                                                                                        return (
                                                                                                                            <FontAwesomeIcon icon={faCheck} className="text-success"/>
                                                                                                                        )
                                                                                                                    }
                                                                                                                })()
                                                                                                            }
                                                                                                            {freelancer.user.profile.first_name} {freelancer.user.profile.last_name}
                                                                                                            {
                                                                                                                (()=>{
                                                                                                                    if(freelancer.active) {
                                                                                                                        return (
                                                                                                                            <RemoveTask
                                                                                                                                callback={()=>{this.get()}}
                                                                                                                                jobId={this.props.router.query.id}
                                                                                                                                taskId={task._id}
                                                                                                                                userId={freelancer.user._id}
                                                                                                                            />
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
                                                                                <UpdateTask
                                                                                    taskId={task ? task._id : null}
                                                                                    value={task.priority}
                                                                                    field="priority"
                                                                                    callback={()=>{this.get()}}
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                <AssignTask 
                                                                                    jobId={this.props.list.job ? this.props.list.job._id : null}
                                                                                    taskId={task ? task._id : null}
                                                                                    callback={()=>{this.get()}}
                                                                                />
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                })
                                                            } else {
                                                                return (
                                                                    <tr>
                                                                        <td colSpan="4" className="text-center">No tasks yet</td>
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
    const { job_tasks_data, job_tasks_loading } = state.job_tasks
    return {
        list: job_tasks_data,
        loading: job_tasks_loading
    }
}

export default withRouter(connect(mapStateToProps)(Tasks))
