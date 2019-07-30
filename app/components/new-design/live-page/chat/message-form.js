import React, { useState } from "react";
import { connect } from "react-redux";
import { InputGroup, InputGroupAddon, InputGroupText, Input, FormGroup } from "reactstrap";

import { chatService } from "../../../../services";
import { alertActions, chatActions } from "../../../../actions";

const MessageForm = props => {
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
        <div className="chat-message-form">
            <FormGroup>
                <InputGroup>
                    <InputGroupAddon addonType="prepend">
                        <InputGroupText>+</InputGroupText>
                    </InputGroupAddon>
                    <Input onKeyDown={sendMessage} value={message} onChange={_e=>setMessage(_e.target.value)} placeholder="Your message..." />
                    <InputGroupAddon addonType="append">
                        <InputGroupText>
                            <img src="/static/img/new-design/microphone.png" />
                        </InputGroupText>
                    </InputGroupAddon>
                </InputGroup>
            </FormGroup>
        </div>
    );
};

export default connect()(MessageForm);
