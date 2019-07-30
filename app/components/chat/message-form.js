import React, { useState } from 'react'
import { connect } from "react-redux";
import { Input } from 'reactstrap'

import { chatService } from '../../services'
import { alertActions, chatActions } from '../../actions'

const MessageForm = (props) => {

    const [message, setMessage] = useState('')

    const sendMessage = _e => {
        if(_e.keyCode === 13 && message.trim() !== '') {
            let msg = message;
            setMessage('');
            chatService.newMessage(props.roomId, props.userId, msg)
                .then(_res => {
                    props.dispatch(chatActions.addMessage(_res.message))
                })
                .catch(_err => {
                    props.dispatch(alertActions.error(_err))
                })
        }
    }

    return (
        <Input onKeyDown={sendMessage} value={message} onChange={_e=>setMessage(_e.target.value)} placeholder="Your message..." />
    )

}

export default connect()(MessageForm)