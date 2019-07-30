import React, { useRef, useEffect } from 'react'

import Message from './message'

const Messages = (props) => {

    const messageEnd = useRef(null);

    const { messagesId } = props
    const prevProps = useRef({messagesId: null})

    useEffect(()=> {
        if(prevProps.current.messagesId !== messagesId) {
            prevProps.current.messagesId = messagesId
            messageEnd.current.scrollIntoView({ behavior: 'smooth' });
        }
    })

    return (
        <div className="messages">
            {
                (()=> {
                    if(props.messages.length > 0) {
                        return props.messages.map(_msg => {
                            return <Message 
                                        refreshId={`${new Date().getTime()}${_msg._id}`}
                                        messageId={_msg._id}
                                        fromUserId={props.userId}
                                        roomId={props.roomId}
                                        active={_msg.from._id === props.userId}
                                        key={_msg._id}
                                        message={_msg.text}
                                        status={_msg.views.includes(props.userId)}
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
        </div>
    )

}

export default Messages