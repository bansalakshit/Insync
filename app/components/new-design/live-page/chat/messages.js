import React, { useRef, useEffect } from "react";
import { connect } from "react-redux";

import Message from "./message";

const Messages = props => {

    const messageEnd = useRef(null);

    const { messagesId } = props
    const prevProps = useRef({messagesId: null})

    useEffect(()=> {
        if(prevProps.current.messagesId !== messagesId) {
            prevProps.current.messagesId = messagesId
            messageEnd.current.scrollIntoView({ behavior: 'smooth' });
        }
    });

    const now = () => {
        return new Date();
    };

    return (
        <React.Fragment>
            {
                (()=> {
                    if(props.messages.length > 0) {
                        return props.messages.map(_msg => {
                            return <Message 
                                        roomId={props.roomId}
                                        messageId={_msg._id}
                                        active={_msg.from._id === props.user._id}
                                        key={_msg._id}
                                        message={_msg.text}
                                        status={_msg.views.includes(props.user._id)}
                                        img={_msg.from.profile.img}
                                        from={`${_msg.from.profile.first_name} ${_msg.from.profile.last_name[0]}.`}
                                        time={_msg.createdAt}
                                    />
                        })
                    } else {
                        return <div className="text-center">No messages yet...</div>
                    }
                })()
            }
            <div ref={messageEnd} />
        </React.Fragment>
    );
};


function mapStateToProps(state) {
    const { user } = state.authentication;
    return { user };
}

export default connect(mapStateToProps)(Messages);
