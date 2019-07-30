import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import { FormGroup, Input } from "reactstrap";
import classnames from "classnames";

import { formatLog } from "../../../helpers/log";
import { userTaskActions, alertActions } from "../../../actions";
import { jobService } from "../../../services";

import Loader from "../../loader";
import RemoveTask from "../../jobs/remove-task";
import UpdateTask from "../../jobs/update-task";

const Item = props => {
    if (props.task)
        return (
            <li className="item">
                {/* <Input type="checkbox" /> */}
                <div
                    className={classnames("description", {
                        active: props.task.current
                    })}
                >
                    <UpdateTask taskId={props.task.info._id} value={props.task.info.description} field="description" />
                </div>
                <div className="time">{formatLog(props.task.seconds, true, true)}</div>
                <div className="remove-task">
                    <RemoveTask
                        callback={() => {
                            props.callback();
                        }}
                        jobId={props.task.info.job._id}
                        taskId={props.task.info._id}
                        userId={props.userId}
                    />
                </div>
            </li>
        );
    else return "";
};

const Items = props => {
    return (
        <React.Fragment>
            <Item userId={props.userId} task={props.active} callback={props.callback} />
            {(() => {
                if (props.tasks) {
                    return props.tasks.map(task => {
                        return <Item userId={props.userId} key={task.info._id} task={task} callback={props.callback} />;
                    });
                }
            })()}
        </React.Fragment>
    );
};

const Tasks = props => {
    const [task, setTask] = useState("");
    const prevProps = useRef({ userId: null });
    const { userId } = props;

    const [containerHeight, setContainerHeight] = useState({ height: "0px" });
    const [listHeight, setListHeight] = useState({ height: "0px" });

    const get = () => {
        props.dispatch(userTaskActions.getUserTasks(userId));
    };

    const handleChange = e => {
        setTask(e.target.value);
    };

    const handleKeyDown = e => {
        if (e.keyCode === 13) {
            if (task) {
                let activeTask = props.user_tasks_data.find(el => el.current);
                if (!activeTask) activeTask = props.user_tasks_data[0];

                jobService
                    .createTask(activeTask.info.job._id, {
                        task: task,
                        link: "",
                        priority: 1,
                        users: [userId]
                    })
                    .then(_res => {
                        setTask("");
                        get();
                    })
                    .catch(_err => {
                        props.dispatch(alertActions.error(_err.message));
                    });
            }
        }
    };

    const resize = () => {
        let h = window.innerHeight - 120 - 43;
        setContainerHeight({ height: `${h * 0.5}px` });
        h = h * 0.5;
        setListHeight({ height: `${h * 0.73}px` });
    };

    useEffect(() => {
        if (prevProps.current.userId !== userId) {
            resize();

            prevProps.current.userId = userId;
            get();
            window.addEventListener("resize", resize);
        }
    });

    return (
        <div className="tasks-list" style={containerHeight}>
            <ul className="tasks" style={listHeight}>
                {(() => {
                    if (props.user_tasks_loading) {
                        return (
                            <li className="text-center">
                                <Loader />
                            </li>
                        );
                    } else {
                        if (props.user_tasks_data && props.user_tasks_data.length > 0) {
                            const active = props.user_tasks_data.find(el => el.current);
                            const tasks = props.user_tasks_data.filter(el => !el.current);

                            return <Items userId={userId} active={active} tasks={tasks} callback={get} />;
                        } else {
                            return <li className="text-center">No tasks yet...</li>;
                        }
                    }
                })()}
            </ul>

            <div className="add-form">
                <FormGroup>
                    <Input value={task} placeholder="Add new task..." autoComplete="off" type="text" name="task" onKeyDown={handleKeyDown} onChange={handleChange} />
                </FormGroup>
            </div>
        </div>
    );
};

function mapStateToProps(state) {
    const { user_tasks_loading, user_tasks_data } = state.user_tasks;
    return {
        user_tasks_data,
        user_tasks_loading
    };
}

export default connect(mapStateToProps)(Tasks);
