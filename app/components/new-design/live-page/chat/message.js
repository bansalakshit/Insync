import React, { useEffect } from 'react'
import { Media } from "reactstrap";
import { connect } from "react-redux";
import TimeAgo from "react-timeago";
import englishStrings from "react-timeago/lib/language-strings/en";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
const formatter = buildFormatter(englishStrings);

import { chatActions } from "../../../../actions";

import Avatar from "../../common/user/avatar";

const Message = props => {
    useEffect(() => {
        if (!props.active && !props.status) {
            props.dispatch(chatActions.updateMessageStatus(props.roomId, props.messageId));
        }
    }, []);

    return (
        <Media className="chat-message">
            <Media className="avatar">
                <Avatar img={props.img}/>
            </Media>
            <Media body>
                <div className="name">{props.from} <span className="time"><TimeAgo date={props.time} formatter={formatter} /></span></div>
                <div className="text">{props.message}</div>
            </Media>
        </Media>
    );
};

export default connect()(Message);
