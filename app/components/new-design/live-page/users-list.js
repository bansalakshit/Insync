import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";

import { InputGroup, Input, InputGroupAddon, FormGroup } from "reactstrap";

import { liveActions } from "../../../actions";

import UserCard from "../common/user/card";
import OnlineStatus from "../common/user/online-status";
import UnseenMessages from "../common/unseen-messages";
import Loader from "../../loader";

const UsersList = props => {
    const [height, setHeight] = useState({ height: "0px" });
    const [index, setIndex] = useState(0);
    const [searchText, setSearchText] = useState("");

    const prevProps = useRef({ updateId: null });

    const selectUser = _index => {
        if (props.data && props.data.length > 0) {
            setIndex(_index);
            props.dispatch(liveActions.changeUser(props.data[_index]));
        }
    };

    const handleKeyDown = _event => {
        if (props.data && props.data.length > 0) {
            const maxUser = props.data.length - 1;
            if (_event.keyCode === 38) {
                // arrow up
                selectUser(index === 0 ? maxUser : index - 1);
            } else if (event.keyCode === 40) {
                // arrow down
                selectUser(index === maxUser ? 0 : index + 1);
            }
        }
    };

    const resize = () => {
        setHeight({ height: `${window.innerHeight - 120 - 128}px` });
    };

    useEffect(() => {
        if (prevProps.current.updateId !== props.updateId) {
            if (props.job) props.dispatch(liveActions.getLive(props.job));
            prevProps.current.updateId = props.updateId;
            resize();
            selectUser(0);
            setSearchText("");
            window.addEventListener("resize", resize);
        }
        document.addEventListener("keydown", handleKeyDown);
    });

    const search = _e => {
        setSearchText(_e.target.value);
        props.dispatch(liveActions.searchEmployees(_e.target.value));
    };

    return (
        <div className="users-list">
            <div className="search-box">
                <InputGroup>
                    <InputGroupAddon addonType="prepend">
                        <img src="/static/img/new-design/search.png" />
                    </InputGroupAddon>
                    <Input placeholder="Search..." value={searchText} onChange={search} />
                </InputGroup>
            </div>
            <div className="users" style={height}>
                {(() => {
                    if (props.loading) {
                        return (
                            <div className="text-center">
                                <Loader />
                            </div>
                        );
                    } else {
                        if (props.data && props.data.length > 0) {
                            return props.data.map((_user, _index) => {
                                return (
                                    <div
                                        onClick={() => {
                                            selectUser(_index);
                                        }}
                                        key={_user._id}
                                        className={`user-item ${index === _index ? "active" : ""}`}
                                    >
                                        <UserCard img={_user.profile.img} name={`${_user.profile.first_name} ${_user.profile.last_name}`} text={_user.screenshots[0] ? _user.screenshots[0].task : ""} />
                                        <div className="legends">
                                            <OnlineStatus status={_user.profile.isOnline} />
                                            {/* <UnseenMessages userId={_user._id} jobId={_user.jobId} /> */}
                                        </div>
                                    </div>
                                );
                            });
                        } else {
                            return <div className="text-center">No employees yet.</div>;
                        }
                    }
                })()}
            </div>
        </div>
    );
};

function mapStateToProps(state) {
    const { data, loading } = state.live;
    return { data, loading };
}

export default connect(mapStateToProps)(UsersList);
