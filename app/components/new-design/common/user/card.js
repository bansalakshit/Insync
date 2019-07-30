import React from "react";
import { Media } from "reactstrap";
import Avatar from "./avatar";

const UserCard = props => {
    return (
        <Media className="user-card">
            <Media left className="avatar">
                <Avatar img={props.img} />
            </Media>
            <Media body>
                <div className="name">{props.name}</div>
                <div className="helper-text">{props.text}</div>
            </Media>
        </Media>
    );
};

export default UserCard;
