import React, { useEffect } from "react";
import { connect } from "react-redux";
import { chatActions } from "../../../actions";
import MessagesCount from "./messages-count";

const UnseenMessages = props => {
    const { userId, jobId } = props;

    useEffect(() => {
        props.dispatch(chatActions.createRoom(jobId, userId));
    }, []);

    return ( 
        <React.Fragment>
            {
                (()=> {
                    if(!props.loading_room && props.room) {
                        return <MessagesCount roomId={props.room ? props.room._id : null} />
                    }
                })()
            }
        </React.Fragment>
    );
};

function mapStateToProps(state) {
    const { room, loading_room } = state.chat;
    return { room, loading_room };
}

export default connect(mapStateToProps)(UnseenMessages);
