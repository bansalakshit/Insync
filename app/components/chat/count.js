import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Badge } from "reactstrap";
import { chatActions } from "../../actions";

const Count = props => {
    useEffect(() => {
        props.dispatch(chatActions.getUnseen(props.roomId));
    }, []);

    return (
        <React.Fragment>
            {
                (()=> {
                    if(props.unseen > 0) {
                        return <Badge color="danger">{props.unseen}</Badge>
                    }
                })()
            }
        </React.Fragment>
    );
};

function mapStateToProps(state) {
    const { unseen } = state.chat;
    return { unseen };
}

export default connect(mapStateToProps)(Count);
