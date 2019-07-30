import React from 'react'
import { connect } from 'react-redux'

import { Row, Col, Table, Button } from 'reactstrap'

import { jobService } from '../services'
import { jobActions, alertActions, userTaskActions } from '../actions'
import SidebarCreateTask from './sidebar-create-task'
import UpdateTask from './jobs/update-task'

class SidebarJobTasksList extends React.Component {

    constructor(props) {
        super(props)

        this.assign = this.assign.bind(this)
    }

    assign(_taskId) {
        jobService.assignTask(this.props.jobId, _taskId, {users: [this.props.userId]})
            .then(_res => {
                this.props.dispatch(userTaskActions.getUserTasks(this.props.userId))
                this.props.dispatch(alertActions.success('Employee was assigned successfully'))
            })
            .catch(_err => {
                this.props.dispatch(alertActions.error(_err.message))
            })
    }

    componentDidMount() {
        this.get()
    }

    componentDidUpdate(prevProps) {
        if(this.props.jobId !== prevProps.jobId)
            this.get()
    }

    get() {
        this.props.dispatch(jobActions.getTasks(this.props.jobId), true)
    }

    render() {
        return (
            <Row>
                    {
                        (()=> {
                            if(this.props.job_tasks_loading) {
                                return (
                                    <Col sm="12" className="text-center">Loading...</Col>
                                )
                            } else {
                                if(this.props.job_tasks_data)
                                    return (
                                        <React.Fragment>
                                            <Col sm="12">
                                                <h5>
                                                    {this.props.job_tasks_data.job ? this.props.job_tasks_data.job.title : ''} - Tasks List
                                                </h5>
                                            </Col>
                                            <Col sm="12">
                                                <Table>
                                                    <thead>
                                                        <tr>
                                                            <th>Description</th>
                                                            <th>
                                                                Priority
                                                            </th>
                                                            <th></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                    {
                                                        (() => {
                                                            if(this.props.job_tasks_data && this.props.job_tasks_data.tasks && this.props.job_tasks_data.tasks.length > 0) {
                                                                return this.props.job_tasks_data.tasks.map(task => {
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
                                                                                <UpdateTask
                                                                                    taskId={task ? task._id : null}
                                                                                    value={task.priority}
                                                                                    field="priority"
                                                                                    callback={()=>{this.get()}}
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                <Button color="primary" onClick={()=>{this.assign(task._id)}}>Assign Task</Button>
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
                                            <Col sm="12">
                                                    <SidebarCreateTask
                                                        jobId={this.props.jobId}
                                                        userId={this.props.userId}
                                                    />
                                            </Col>
                                        </React.Fragment>
                                    )
                            }
                        })()
                    }
            </Row>
        )
    }

}

function mapStateToProps(state) {
    const { job_tasks_data, job_tasks_loading } = state.job_tasks
    return {
        job_tasks_data,
        job_tasks_loading
    }
}

export default connect(mapStateToProps)(SidebarJobTasksList)