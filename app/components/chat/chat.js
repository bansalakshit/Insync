import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import { chatActions } from "../../actions";
import { userInfo } from "../../helpers";
import MessageForm from "./message-form";
import Messages from "./messages";

const Chat = props => {
    const [messageContainerStyle, setMessageContainerStyle] = useState({
        height: "0px"
    });

    const { userId, jobId } = props;

    let client = null;
    let user = null;

    const subscribeChannel = (_client, _user) => {
        _client.subscribe({
            key: _user.profile.channel_key,
            channel: `InSync/${_user._id}/newMessage`
        });

        _client.on("message", _data => {
            try {
                const data = JSON.parse(_data.binary.toString());
                if (data.message) {
                    props.dispatch(chatActions.addMessage(data.message));
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
        const height = document.getElementsByClassName("live-sidebar")[0].clientHeight - 250;
        setMessageContainerStyle({ height: `${height}px` });
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
        <div className="chat">
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
                            {(() => {
                                if (props.loading_history)
                                    return (
                                        <div className="text-center">
                                            <FontAwesomeIcon icon={faSpinner} className="fa-spin" />
                                        </div>
                                    );
                            })()}
                            <div onScroll={onScroll} className="messages-container" style={messageContainerStyle}>
                                <Messages roomId={props.room ? props.room._id : null} userId={userId} messagesId={props.messagesId} messages={props.messages} />
                            </div>
                        </React.Fragment>
                    );
                }
            })()}
            <MessageForm userId={userId} roomId={props.room ? props.room._id : null} />
        </div>
    );
};

function mapStateToProps(state) {
    const { loading, loading_history, messages, lastMessageId, messagesId, room, loading_room } = state.chat;
    return { loading, loading_history, messages, lastMessageId, messagesId, room, loading_room };
}

export default connect(mapStateToProps)(Chat);
