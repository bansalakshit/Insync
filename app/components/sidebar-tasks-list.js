import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { Row, Col, FormGroup, Input } from "reactstrap";
import classnames from "classnames";
import { userTaskActions, alertActions } from "../actions";
import { formatLog } from "../helpers";
import RemoveTask from "./jobs/remove-task";
import UpdateTask from "./jobs/update-task";
import { jobService } from "../services";

let Item = props => {
    if (props.task)
        return (
            <Row
                className={classnames("item m-0", {
                    active: props.task.current
                })}
                key={props.task.info._id}
            >
                <Col xs="8" sm="9">
                    <UpdateTask
                        taskId={props.task.info._id}
                        value={props.task.info.description}
                        field="description"
                    />
                </Col>
                <Col xs="2" sm="2">
                    <span className="log-time">
                        {formatLog(props.task.seconds, true, true)}
                    </span>
                </Col>
                <Col xs="1" sm="1">
                    <RemoveTask
                        callback={() => {
                            props.callback();
                        }}
                        jobId={props.task.info.job._id}
                        taskId={props.task.info._id}
                        userId={props.userId}
                    />
                </Col>
            </Row>
        );
    else return "";
};

let Items = props => {
    return (
        <React.Fragment>
            <Item
                userId={props.userId}
                task={props.active}
                callback={props.callback}
            />
            {(() => {
                if (props.tasks) {
                    return props.tasks.map(task => {
                        return (
                            <Item
                                userId={props.userId}
                                key={task.info._id}
                                task={task}
                                callback={props.callback}
                            />
                        );
                    });
                }
            })()}
        </React.Fragment>
    );
};

const SidebarTasksList = props => {
    const [task, setTask] = useState("");
    const [taskListStyle, setTaskListStyle] = useState({height: '0px'})

    const { userId } = props;
    const prevProps = useRef({ userId: null });

    const handleChange = e => {
        setTask(e.target.value);
    };

    const handleKeyDown = e => {
        if (e.keyCode === 13) {
            if (task) {
                const activeTask = props.user_tasks_data.find(el => el.current);
                jobService
                    .createTask(activeTask.info.job._id, {
                        task: task,
                        link: "",
                        priority: 1,
                        users: [props.userId]
                    })
                    .then(_res => {
                        setTask('')
                        props.dispatch(
                            userTaskActions.getUserTasks(props.userId)
                        );
                    })
                    .catch(_err => {
                        props.dispatch(alertActions.error(_err.message));
                    });
            }
        }
    };

    const get = () => {
        props.dispatch(userTaskActions.getUserTasks(userId));
    };

    useEffect(() => {
        const height = document.getElementsByClassName('live-sidebar')[0].clientHeight - 240
        setTaskListStyle({height: `${height}px`})
        if (prevProps.current.userId !== userId) {
            prevProps.current.userId = userId;
            get();
        }
    });

    return (
        <Row>
            <Col sm="12"  className="sidebar-task-list" style={taskListStyle}>
                {(() => {
                    if (props.user_tasks_loading) {
                        return <div className="text-center">Loading...</div>;
                    } else {
                        if (
                            props.user_tasks_data &&
                            props.user_tasks_data.length > 0
                        ) {
                            const active = props.user_tasks_data.find(
                                el => el.current
                            );
                            const tasks = props.user_tasks_data.filter(
                                el => !el.current
                            );

                            return (
                                <Items
                                    userId={userId}
                                    active={active}
                                    tasks={tasks}
                                    callback={get}
                                />
                            );
                        } else {
                            return (
                                <div className="text-center">
                                    No tasks yet...
                                </div>
                            );
                        }
                    }
                })()}
            </Col>
            <Col sm="12">
                <FormGroup>
                    <Input
                        value={task}
                        placeholder="New task..."
                        autoComplete="off"
                        type="text"
                        name="task"
                        onKeyDown={handleKeyDown}
                        onChange={handleChange}
                    />
                </FormGroup>
            </Col>
        </Row>
    );
};

function mapStateToProps(state) {
    const { user_tasks_loading, user_tasks_data } = state.user_tasks;
    return {
        user_tasks_data,
        user_tasks_loading
    };
}

export default connect(mapStateToProps)(SidebarTasksList);
