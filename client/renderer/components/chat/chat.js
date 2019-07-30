import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Badge } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import classnames from "classnames";

import { chatActions } from "../../actions";
import { userInfo } from "../../helpers";
import MessageForm from "./message-form";
import Messages from "./messages";

const Chat = props => {
    const { userId, jobId } = props;

    const [fullbar, setFullbar] = useState(false);

    const chatBoxHeight = window.innerHeight * 0.75;
    const messageBoxHeight = chatBoxHeight - 44;

    const handleResize = () => {
        chatBoxHeight = window.innerHeight * 0.75;
        messageBoxHeight = chatBoxHeight - 44;
    };

    document.addEventListener("resize", handleResize);

    let client = null;
    let user = null;

    const toggleMessages = () => {
        setFullbar(!fullbar);
    };

    const subscribeChannel = (_client, _user) => {
        _client.subscribe({
            key: _user.profile.channel_key,
            channel: `InSync/${_user._id}/newMessage`
        });

        _client.subscribe({
            key: _user.profile.channel_key,
            channel: `InSync/${_user._id}/unseen`
        });

        _client.on("message", _data => {
            try {
                const data = JSON.parse(_data.binary.toString());
                if (_data.channel.includes("newMessage")) {
                    if (data.message) {
                        setTimeout(() => {
                            props.dispatch(chatActions.addMessage(data));
                            if (_user._id !== data.message.from._id) {
                                new window.Notification("InSync Team", {
                                    body: "New message"
                                });
                            }
                        }, 800);
                    }
                }
                if (_data.channel.includes("unseen")) {
                    if (typeof data.count !== "undefined") {
                        props.dispatch(chatActions.updateUnseen(data.count));
                    }
                }
            } catch (_err) {}
        });
    };

    const unsubscribeChannel = (_client, _user) => {
        _client.unsubscribe({
            key: _user.profile.channel_key,
            channel: `InSync/${_user._id}/newMessage`
        });
    };

    const onScroll = e => {
        if (e.target.scrollTop === 0) {
            props.dispatch(chatActions.getHistory(props.room._id, props.lastMessageId));
        }
    };

    useEffect(() => {
        props.dispatch(chatActions.createRoom(jobId, userId));
        if(props.room) {
            props.dispatch(chatActions.getMessages(props.room._id));
        }

        user = userInfo();
        client = emitter.connect({ secure: true });
        client.on("connect", () => {
            subscribeChannel(client, user);
        });
    }, []);

    return (
        <div className={classnames("chat-container", { chat: !fullbar, "chat-fullbar": fullbar })}>
            {(() => {
                if (props.loading || props.loading_room) {
                    return (
                        <div className="text-center">
                            <FontAwesomeIcon icon={faSpinner} className="fa-spin" />
                        </div>
                    );
                } else {
                    return (
                        <React.Fragment>
                            <div className="info-box" onClick={toggleMessages}>
                                Messages
                                {(() => {
                                    if (props.unseen > 0) return <Badge color="danger">{props.unseen}</Badge>;
                                })()}
                                <span className="icon">
                                    {fullbar && <FontAwesomeIcon icon={faAngleDown} />}
                                    {!fullbar && <FontAwesomeIcon icon={faAngleUp} />}
                                </span>
                            </div>
                            {(() => {
                                if (fullbar) {
                                    return (
                                        <React.Fragment>
                                            {(() => {
                                                if (props.loading_history)
                                                    return (
                                                        <div className="text-center">
                                                            <FontAwesomeIcon icon={faSpinner} className="fa-spin" />
                                                        </div>
                                                    );
                                            })()}
                                            <div onScroll={onScroll} className="chat-box" style={{ height: `${chatBoxHeight}px` }}>
                                                <Messages roomId={props.room ? props.room._id : null} userId={userId} height={messageBoxHeight} messages={props.messages} messagesId={props.messagesId} />
                                            </div>

                                            <MessageForm userId={userId} roomId={props.room ? props.room._id : null} />
                                        </React.Fragment>
                                    );
                                }
                            })()}
                        </React.Fragment>
                    );
                }
            })()}
        </div>
    );
};

function mapStateToProps(state) {
    const { loading, loading_history, messages, lastMessageId, unseen, messagesId, room, loading_room  } = state.chat;
    return { loading, loading_history, messages, lastMessageId, unseen, messagesId, room, loading_room };
}

export default connect(mapStateToProps)(Chat);
