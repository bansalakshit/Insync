import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";

import { chatActions } from "../../../../actions";
import { userInfo } from "../../../../helpers";

import Messages from "./messages";
import MessageForm from "./message-form";
import Loader from "../../../loader";

const Chat = props => {
    const prevProps = useRef({ userId: null });

    const [containerHeight, setContainerHeight] = useState({ height: "0px" });
    const [messagesHeight, setMessagesHeight] = useState({ height: "0px" });

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

    const resize = () => {
        let h = window.innerHeight - 120 - 43;
        setContainerHeight({ height: `${h * 0.5}px` });
        h = h * 0.5;
        setMessagesHeight({ height: `${h * 0.73}px` });
    };

    useEffect(() => {
        if (prevProps.current.userId !== userId) {
            prevProps.current.userId = userId;
            resize();
            props.dispatch(chatActions.createRoom(jobId, userId));
            if (props.room) {
                props.dispatch(chatActions.getMessages(props.room._id));
            }
            user = userInfo();
            client = emitter.connect({ secure: true });
            client.on("connect", () => {
                subscribeChannel(client, user);
            });
            window.addEventListener("resize", resize);
        }
    });

    return (
        <div className="chat-box" style={containerHeight}>
            {(() => {
                if (props.loading || props.loading_room) {
                    return (
                        <div className="text-center">
                            <Loader />
                        </div>
                    );
                } else {
                    return (
                        <React.Fragment>
                            {(() => {
                                if (props.loading_history)
                                    return (
                                        <div className="text-center">
                                            <Loader />
                                        </div>
                                    );
                            })()}
                            <div className="chat-messages" style={messagesHeight} onScroll={onScroll}>
                                <Messages roomId={props.room ? props.room._id : null} userId={userId} messagesId={props.messagesId} messages={props.messages} />
                            </div>
                        </React.Fragment>
                    );
                }
            })()}
            {!props.loading_room_error && <MessageForm userId={userId} roomId={props.room ? props.room._id : null} />}
        </div>
    );
};

function mapStateToProps(state) {
    const { loading, loading_history, messages, lastMessageId, messagesId, room, loading_room, loading_room_error } = state.chat;
    return { loading, loading_history, messages, lastMessageId, messagesId, room, loading_room, loading_room_error };
}

export default connect(mapStateToProps)(Chat);
