import React from "react";

const OnlineStatus = props => {
    return (
        <div className={`online-status ${props.status ? 'online': 'offline'}`}></div>
    )
}

export default OnlineStatus;