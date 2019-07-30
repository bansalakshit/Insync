import React, { useEffect } from "react";
import { connect } from "react-redux";
import { chatActions } from "../../../actions";

const MessagesCount = props => {
    useEffect(() => {
        props.dispatch(chatActions.getUnseen(props.roomId));
    }, []);

    return (
        <React.Fragment>
            {(() => {
                if (props.unseen > 0) {
                    return <div className="messages-count">{props.unseen}</div>;
                }
            })()}
        </React.Fragment>
    );
};

function mapStateToProps(state) {
    const { unseen } = state.chat;
    return { unseen };
}

export default connect(mapStateToProps)(MessagesCount);
