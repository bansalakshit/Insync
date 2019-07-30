import React from 'react'
import { connect } from 'react-redux'
import Router, { withRouter } from 'next/router'
import { Row, Col, FormGroup, Input, ListGroup, ListGroupItem, Alert } from 'reactstrap'
import { jobActions, configActions, alertActions } from '../actions'
import { isLoggedIn, userInfo, formatTime } from '../helpers'
import { jobService } from '../services'
import TaskTimer from '../components/task-timer'
import Chat from '../components/chat/chat'
import Ping from '../components/ping'
import { appConfig } from '../config'

class Home extends React.Component {

    constructor(props) {
        super(props)
    
        this.state = {
            jobUpdate: false,
            job: '',
            activeJob: null,
            loadingTasks: false,
            tasksList: null,
            activeTask: null,
            list: null,
            totalSeconds: 0,
            connected: false,
            stopOnGoingTask: false,
            tempTasks: null,
            task: '',
            processing: false
        }

        this.showJobDropdown = this.showJobDropdown.bind(this)
        this.updateActiveTask = this.updateActiveTask.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleNewTask = this.handleNewTask.bind(this)
        this.handleRemoveTask = this.handleRemoveTask.bind(this)
        this.handleNewJob = this.handleNewJob.bind(this)
        this.handleNewLog = this.handleNewLog.bind(this)
        this.connectEmitter = this.connectEmitter.bind(this)
        this.handleKeyDown = this.handleKeyDown.bind(this)
        this.idleThreshold = 60 // 1 minute
        this.captureScreenshot = 120 // 2 minutes
        this.taskUpdateTime = 1800 // 30 minutes
    }

    connectEmitter() {
        console.log('connecting')
        let user = userInfo()
        if(typeof emitter !== 'undefined' && user && !this.state.connected) {
            this.client = emitter.connect({secure: true})
            
            this.client.on('message', _data => {
                if(_data.channel.includes('newTask'))
                    this.handleNewTask(_data.binary.toString())
                if(_data.channel.includes('removeTask'))
                    this.handleRemoveTask(_data.binary.toString())
                if(_data.channel.includes('newJob'))
                    this.handleNewJob(_data.binary.toString())
                if(_data.channel.includes('newLog'))
                    this.handleNewLog(_data.binary.toString())
            })

            this.client.on('connect', () => {
                console.log('connected to emitter')
                this.client.subscribe({
                    key: user.profile.channel_key,
                    channel: `InSync/${user._id}/+/`
                })
                this.setState({
                    connected: true
                })
            })

            this.client.on('disconnect', () => {
                console.log('Disconnected')
            })
        }

        if(!this.state.connected) {
            setTimeout(() => {
                this.connectEmitter()
            }, 5000)
        }
    }

    showJobDropdown(_status) {
        if(!_status) {
            this.setState({
                jobUpdate: _status
            })
        } else {
            if(!this.state.activeTask) {
                this.setState({
                    jobUpdate: _status
                })
            }
        }
    }

    updateActiveTask(_task) {
        this.setState({
            activeTask: _task
        })
    }

    getTasks(_jobId) {
        this.setState({
            loadingTasks: true
        })
        jobService.userTasks(_jobId)
            .then(_res => {
                this.setState({
                    tasksList: _res.data,
                    loadingTasks: false
                })
            })
            .catch(_err => {
                this.setState({
                    loadingTasks: false
                })
            })
    }

    handleChange(e) {
        const { name, value } = e.target
        if(name === 'job') {
            let user = userInfo()
            let job = this.props.list.find(j=>j._id===value)
            localStorage.setItem(`job-${user._id}`, JSON.stringify(job))
            this.setState({
                activeJob: job
            })
            this.getTasks(value)
            this.props.dispatch(jobActions.getLogToday(value))
        }
        this.setState({
            [name]: value
        })
    }

    handleKeyDown(e) {
        if(e.keyCode === 13) {
            let user = userInfo()
            if(this.state.task && this.state.job && user) {
                this.setState({
                    processing: true
                })
                jobService.createTask(this.state.job, {task: this.state.task, link: '', priority: 1, users: [user._id]})
                    .then(_res => {
                        this.setState({
                            task: '',
                            processing: false
                        })
                        this.getTasks(this.state.job)
                    })
                    .catch(_err => {
                        this.setState({
                            processing: false
                        })
                        this.props.dispatch(alertActions.error(_err.message))
                    })
            }
        }
    }

    handleNewTask(_data) {
        let data = JSON.parse(_data)
        if(this.state.job === data.job) {
            let tasks = this.state.tasksList
            tasks.push({
                description: data.description,
                link: data.link,
                priority: data.priority,
                totalSeconds: 0,
                _id: data._id
            })
            this.setState({
                tasksList: tasks
            })
        }
    }

    stopOnGoingTaskCallback() {
        let tasks = this.state.tempTasks
        this.setState({
            tasksList: tasks,
            tempTasks: null,
            stopOnGoingTask: false
        })
        new window.Notification('InSync Team', {
            body: 'Task was remove from your task list.',
        })
    }

    handleRemoveTask(_data) {
        let data = JSON.parse(_data)
        if(this.state.tasksList && this.state.tasksList.length > 0) {
            if(this.state.activeTask === data._id) {
                let tempTasks = this.state.tasksList.filter(_task => _task._id !== data._id)
                this.setState({
                    stopOnGoingTask: true,
                    tempTasks: tempTasks
                })
            } else {
                let tasks = this.state.tasksList.filter(_task => _task._id !== data._id)
                this.setState({
                    tasksList: tasks
                })
            }
        }
    }

    handleNewLog(_data) {
        let data = JSON.parse(_data)
        if(data.totalSeconds) {
            this.setState({
                totalSeconds: data.totalSeconds
            })
        }
    }

    handleNewJob(_data) {
        let data = JSON.parse(_data)
        if(data._id) {
            let jobs = this.state.list
            jobs.push(data)
            this.setState({
                list: jobs
            })
        }
    }

    componentDidUpdate(prevProps) {
        // if(!this.state.connected) {
        //     this.connectEmitter()
        // }
        if(prevProps.list !== this.props.list) {
            this.setState({
                list: this.props.list
            })
        }
        if(prevProps.totalSeconds !== this.props.totalSeconds) {
            this.setState({
                totalSeconds: this.props.totalSeconds
            })
        }
    }

    componentDidMount() {
        if(!isLoggedIn()) {
            Router.push({
                pathname: '/'
            })
        } else {
            try {
                let user = userInfo()
                let job = localStorage.getItem(`job-${user._id}`)
                if(job) {
                    job = JSON.parse(job)
                    this.setState({
                        activeJob: job,
                        job: job._id
                    })
                    this.getTasks(job._id)
                    this.props.dispatch(jobActions.getLogToday(job._id))
                }
                // this.connectEmitter()
            } catch(_err) {
                console.log(_err, '_err')
            }
            this.props.dispatch(jobActions.getList())
            this.props.dispatch(configActions.get())
        }
    }

    render() {
        return (
            <React.Fragment>
                
                <Row className="page-content">
                    {
                        (()=>{
                            if(this.props.loadingConfig) {
                                return (
                                    <Col sm="12" className="text-center">Checking app version...</Col>
                                )
                            } else {
                                if(this.props.dataConfig && this.props.dataConfig.version !== appConfig.version) {
                                    return (
                                        <Col sm="12">
                                            <Alert color="danger">
                                                <h4 className="alert-heading">Update InSync App</h4>
                                                <p>
                                                    InSync has new version, please download and install latest version to continue.
                                                </p>
                                            </Alert>
                                        </Col>
                                    )
                                } else {
                                    return (
                                        <React.Fragment>
                                            <Ping />
                                            {
                                                (()=>{
                                                    if(this.props.loading) {
                                                        return (
                                                            <Col sm="12" className="text-center">Loading...</Col>
                                                        )
                                                    } else {
                                                        if(this.state.list && this.state.list.length > 0) {
                                                            return (
                                                                <React.Fragment>
                                                                    <Col sm="12">
                                                                        <h3 className="todays-log-time">Today {formatTime(this.state.totalSeconds)}</h3>
                                                                    </Col>
                                                                    <Col sm="12">
                                                                        <FormGroup>
                                                                            {
                                                                                (()=> {
                                                                                    if(this.state.activeJob && !this.state.jobUpdate) {
                                                                                        return (
                                                                                            <ListGroup onClick={()=>{this.showJobDropdown(true)}}>
                                                                                                <ListGroupItem> 
                                                                                                    {this.state.activeJob.title} - ({this.state.activeJob.owner.profile.first_name} {this.state.activeJob.owner.profile.last_name})
                                                                                                </ListGroupItem>
                                                                                            </ListGroup>
                                                                                        )
                                                                                    } else {
                                                                                        return (
                                                                                            <Input onBlur={()=>{this.showJobDropdown(false)}} value={this.state.job} type="select" name="job" onChange={this.handleChange}>
                                                                                                <option value="">Select Job</option>
                                                                                                {
                                                                                                    (()=> {
                                                                                                        return this.state.list.map(job => {
                                                                                                            return (
                                                                                                                <option key={job._id} value={job._id}>{job.title} - ({job.owner.profile.first_name} {job.owner.profile.last_name})</option>
                                                                                                            )
                                                                                                        })
                                                                                                    })()
                                                                                                }
                                                                                            </Input>
                                                                                        )
                                                                                    }
                                                                                })()
                                                                            }
                                                                        </FormGroup>

                                                                        {
                                                                            (()=>{
                                                                                if(this.state.loadingTasks) {
                                                                                    return <div className="text-center">Loading...</div>
                                                                                } else {
                                                                                    if(this.state.tasksList && this.state.tasksList.length > 0) {
                                                                                        return (
                                                                                            <React.Fragment>
                                                                                                <div className="tasks-list">
                                                                                                    <ListGroup>
                                                                                                        {
                                                                                                            (()=>{
                                                                                                                return this.state.tasksList.map((task, index) => {
                                                                                                                    return (
                                                                                                                        <ListGroupItem key={index} className="task-list"> 
                                                                                                                            <TaskTimer
                                                                                                                                stopOnGoingTaskCallback={()=>{this.stopOnGoingTaskCallback()}}
                                                                                                                                stopOnGoingTask={this.state.stopOnGoingTask}
                                                                                                                                activeTask={this.state.activeTask}
                                                                                                                                trackingCallback={this.updateActiveTask}
                                                                                                                                completeCallback={()=>{this.getTasks(this.state.job)}}
                                                                                                                                id={`task-timer-${index}`}
                                                                                                                                jobId={this.state.job}
                                                                                                                                task={task}
                                                                                                                                idleThreshold={this.idleThreshold}
                                                                                                                                captureScreenshot={this.captureScreenshot}
                                                                                                                                taskUpdateTime={this.taskUpdateTime}
                                                                                                                            />
                                                                                                                        </ListGroupItem>
                                                                                                                    )
                                                                                                                })
                                                                                                            })()
                                                                                                        }
                                                                                                    </ListGroup>
                                                                                                </div>
                                                                                                <br />
                                                                                                <FormGroup>
                                                                                                    <div className="text-center">
                                                                                                        {this.state.processing &&
                                                                                                            <img alt="" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                                                                                                        }
                                                                                                    </div>
                                                                                                    <Input disabled={this.state.activeTask !== null || this.state.processing} placeholder="New task..." autoComplete="off" type="text" name="task" value={this.state.task} onKeyDown={this.handleKeyDown} onChange={this.handleChange} />
                                                                                                </FormGroup>
                                                                                            </React.Fragment>
                                                                                        )
                                                                                    } else {
                                                                                        if(this.state.job) {
                                                                                            return (
                                                                                                <div>
                                                                                                    <div className="text-center">No tasks currently assigned. Please add a task for yourself.</div>
                                                                                                    <br />
                                                                                                        <FormGroup>
                                                                                                            <div className="text-center">
                                                                                                                {this.state.processing &&
                                                                                                                    <img alt="" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                                                                                                                }
                                                                                                            </div>
                                                                                                            <Input disabled={this.state.activeTask !== null || this.state.processing} placeholder="New task..." autoComplete="off" type="text" name="task" value={this.state.task} onKeyDown={this.handleKeyDown} onChange={this.handleChange} />
                                                                                                        </FormGroup>
                                                                                                </div>
                                                                                            )
                                                                                        }
                                                                                    }
                                                                                }
                                                                            })()
                                                                        }
                                                                    </Col>
                                                                </React.Fragment>
                                                            )
                                                        } else {
                                                            return (
                                                                <Col sm="12" className="text-center">No jobs yet</Col>
                                                            )
                                                        }
                                                    }
                                                })()
                                            }
                                        </React.Fragment>
                                    )
                                }
                            }
                        })()
                    }
                </Row>
                {
                    (()=>{
                        if(this.state.activeJob && this.props.user) {
                            return <Chat 
                                        userId={this.props.user._id}
                                        jobId={this.state.activeJob._id}
                                    />
                        }
                    })()
                }
            </React.Fragment>
        )
    }

}


function mapStateToProps(state) {
    const { list, loading } = state.request
    const { totalSeconds } = state.logToday
    const { dataConfig, loadingConfig } = state.config
    const { user } = state.authentication
    return {
        list,
        loading,
        totalSeconds,
        dataConfig,
        loadingConfig,
        user
    }
}

export default withRouter(connect(mapStateToProps)(Home))


