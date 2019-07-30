import React from 'react'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlayCircle, faPauseCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { withRouter } from 'next/router'
import { Row, Col, Button, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter, Tooltip } from 'reactstrap'
import { screen, desktopCapturer, ipcRenderer, remote } from 'electron'
import Timer from '../components/timer'
import IdleDetector from '../components/idle-detector'
import { jobService } from '../services'
import { trackerActions } from '../actions'

class TaskTimer extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            active: false,
            isTracking: false,
            isPause: false,
            seconds: 0,
            secondsFromStart: 0,
            tooltipAction: ''
        }

        this.updateTask = this.updateTask.bind(this)
        // this.toggleModal = this.toggleModal.bind(this)
        this.openDialog = this.openDialog.bind(this)
        this.start = this.start.bind(this)
        this.stop = this.stop.bind(this)
        this.pause = this.pause.bind(this)
        this.resume = this.resume.bind(this)
        this.toggle = this.toggle.bind(this)
        this.done = this.done.bind(this)
        this.toggleTooltip = this.toggleTooltip.bind(this)
        this.hoverAction = this.hoverAction.bind(this)
        this.timerId = null
    }

    toggleTooltip() {
        this.setState({
            tooltipAction: ''
        })
    }

    hoverAction(_action) {
        this.setState({
            tooltipAction: _action
        })
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        })
    }

    updateTask() {
        if(this.state.taskUpdate) {
            this.setState({
                task: this.state.taskUpdate,
                modal: false
            })
        }
    }

    start() {
        if(this.props.jobId && this.state.isTracking === false) {
            this.props.dispatch(trackerActions.run())
            this.props.trackingCallback(this.props.task._id)
            this.setState({
                isTracking: true,
                secondsFromStart: 0
            })
            new window.Notification('InSync Team', {
                body: 'Monitoring started',
            })
            ipcRenderer.send('updateStatus', 'tracking')
            this.timerId = window.setInterval(()=>{
                if(this.state.isTracking && !this.state.isPause) {
                    this.setState({
                        seconds: this.state.seconds += 1,
                        secondsFromStart: this.state.secondsFromStart += 1
                    })
                    if(this.state.seconds >= this.props.captureScreenshot) {
                        let seconds = this.state.seconds
                        this.setState({
                            seconds: 0
                        })
                        this.takeScreenshot(seconds)
                    }
                    // if( (this.state.secondsFromStart % this.props.taskUpdateTime) === 0 ) {
                    //     this.openDialog()
                    // }
                }
            }, 1000)
        }
    }

    stop(_showDialog=false) {
        if(this.props.jobId && this.state.isTracking === true) {
            this.props.dispatch(trackerActions.stop())
            this.props.trackingCallback(null)
            new window.Notification('InSync Team', {
                body: 'Monitoring stopped',
            })
            ipcRenderer.send('updateStatus', 'not-tracking')
            this.setState({
                seconds: 0,
                isTracking: false
            })
            window.clearInterval(this.timerId)
            jobService.stopLog({job: this.props.jobId, task: this.props.task.description, taskId: this.props.task._id, seconds: this.state.seconds})
                .then(_res => {
                    console.log(_res)
                    if(this.props.stopOnGoingTask) {
                        this.props.stopOnGoingTaskCallback()
                    }
                })
            if(_showDialog===true)
                remote.dialog.showErrorBox('Error', 'Monitoring stopped')
        }
    }

    done() {
        if(this.state.isTracking === false) {
            jobService.doneTask(this.props.task._id)
                .then(_res => {
                    this.props.completeCallback()
                })
        }
    }

    determineScreenshot() {
        const screenSize = screen.getPrimaryDisplay().workAreaSize
        const maxDimension = Math.max(screenSize.width, screenSize.height)
    
        return {
            width: maxDimension * window.devicePixelRatio,
            height: maxDimension * window.devicePixelRatio,
        }
    }

    doTakeScreenshot() {
        return new Promise((resolve, reject) => {
            let images = []
            let options = {
                types: ['window', 'screen'],
                thumbnailSize: this.thumbSize
            }
            console.log('Gathering screen...')

            desktopCapturer.getSources(options, (error, resources) => {
                if (error) return reject(error.message)
            
                resources.forEach(source => {
                    if (source.name == 'Entire screen' || source.name == 'Screen 1' || source.name == 'Screen 2') {
                        console.log(source.name)
                        images.push(source.thumbnail.toDataURL())
                    }
                })
                resolve(images)
            })
        })
    }

    takeScreenshot(_seconds) {
        console.log('taking screenshot...')
        let logId = null
        return jobService.log({job: this.props.jobId, task: this.props.task.description, taskId: this.props.task._id, seconds: _seconds})
            .then(_res => {
                console.log(_res)
                logId = _res.message
                return this.doTakeScreenshot()
            })
            .then(_images => {
                return jobService.updateLog({images: _images, id: logId})
            })
            .then(_res => {
                console.log(_res)
            })
            .catch(_err => {
                this.stop(true)
            })
    }

    toggleModal() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }))
    }

    openDialog() {
        remote.dialog.showMessageBox({
            type: 'question',
            buttons: ['Yes', 'Done'],
            title: 'Task Update',
            message: `Are you still working on '${this.state.task}'`,
        }, _response => {
            if(_response == 1) {
                this.toggleModal()
            }
        })
    }

    pause() {
        if(!this.state.isPause) {
            new window.Notification('InSync Team', {
                body: 'Monitoring paused',
            })
            ipcRenderer.send('updateStatus', 'not-tracking')
        }
        console.log('Monitoring paused')
        this.setState({
            isPause: true
        })
    }

    resume() {
        if(this.state.isPause) {
            new window.Notification('InSync Team', {
                body: 'Monitoring resumed',
            })
            ipcRenderer.send('updateStatus', 'tracking')
        }
        console.log('Monitoring resumed')
        this.setState({
            isPause: false
        })
    }

    componentDidMount() {
        this.thumbSize = this.determineScreenshot()
    }

    componentWillUnmount() {
        this.setState({
            isTracking: false
        })
    }

    componentDidUpdate() {
        if(this.props.stopOnGoingTask) {
            this.stop()
        }
    }

    render() {
        return (
            <Row className="task-timer">
                
                <IdleDetector 
                    idleThreshold={this.props.idleThreshold}
                    pauseCallback={()=>{this.pause()}}
                    resumeCallback={()=>{this.resume()}}
                    run={this.state.isTracking}
                />

                <Col sm="7">
                    <div>{this.props.task.description} - <span className="text-muted priority-number">(Priority {this.props.task.priority})</span></div>
                    {
                        (()=>{
                            if(this.props.task.link) {
                                return (
                                    <a className="priority-number" href={this.props.task.link} target="_blank">Details</a>
                                )
                            }
                        })()
                    }
                </Col>


                <Col sm="5" className="timer-container">
                    <Timer 
                        seconds={this.props.task.totalSeconds} 
                        run={this.state.isTracking && !this.state.isPause}
                    />
                    {
                        (()=> {
                            if(!this.state.isTracking) {
                                if(!this.props.activeTask && this.props.activeTask !== this.props.task._id)
                                    return (
                                        <React.Fragment>
                                            <span onMouseOver={()=>{this.hoverAction('start')}} id={`tooltip-start-${this.props.task._id}`} onClick={this.start} className="text-primary pointer"><FontAwesomeIcon icon={faPlayCircle}/></span>
                                            <span onMouseOver={()=>{this.hoverAction('done')}} id={`tooltip-done-${this.props.task._id}`} onClick={this.done} className="text-info pointer ml-1"><FontAwesomeIcon icon={faCheckCircle}/></span>
                                            <Tooltip placement="left" isOpen={this.state.tooltipAction==='start'} target={`tooltip-start-${this.props.task._id}`} toggle={this.toggleTooltip}>
                                                Start tracking time
                                            </Tooltip>
                                            <Tooltip placement="right" isOpen={this.state.tooltipAction==='done'} target={`tooltip-done-${this.props.task._id}`} toggle={this.toggleTooltip}>
                                                Task Done
                                            </Tooltip>
                                        </React.Fragment>
                                    )   
                                else 
                                    return (
                                        <span className="text-muted"><FontAwesomeIcon icon={faPlayCircle}/></span>
                                    )   
                            } else {
                                return (
                                    <React.Fragment>
                                        <span onMouseOver={()=>{this.hoverAction('stop')}} id={`tooltip-stop-${this.props.task._id}`} onClick={this.stop} className="text-danger pointer"><FontAwesomeIcon icon={faPauseCircle}/></span>
                                        <Tooltip placement="left" isOpen={this.state.tooltipAction==='stop'} target={`tooltip-stop-${this.props.task._id}`} toggle={this.toggleTooltip}>
                                            Stop tracking time
                                        </Tooltip>
                                    </React.Fragment>
                                )
                            }
                        })()
                    }

                </Col>


                <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>New Task</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label>Task</Label>
                            <Input type="textarea" name="taskUpdate" onChange={this.handleChange} />
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.updateTask}>Update</Button>{' '}
                        <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </Row>
        )
    }

}

export default withRouter(connect()(TaskTimer))
