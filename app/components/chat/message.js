import React, { useEffect } from 'react'
import { Media } from "reactstrap";
import { connect } from "react-redux";
import TimeAgo from "react-timeago";
import englishStrings from "react-timeago/lib/language-strings/en";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
const formatter = buildFormatter(englishStrings);

import { chatActions } from "../../actions";

import Avatar from '../user/avatar'

const Message = (props) => {

    useEffect(() => {
        if (!props.active && !props.status) {
            props.dispatch(chatActions.updateMessageStatus(props.roomId, props.messageId));
        }
    }, []);

    return (
        <div className="message">
            <Media>
                <Media left top>
                    <span className={(props.active ? `active avatar` : 'avatar')}>
                        <Avatar 
                            img={props.img}
                        />
                    </span>
                </Media>
                <Media body className="message-container">
                    <div className="name">
                        {props.from}
                    </div>
                    <div className="text">{props.message}</div>
                    <div className="time">
                        <TimeAgo date={props.time} formatter={formatter} />
                    </div>
                </Media>
            </Media>
        </div>
    )

}

export default connect()(Message);