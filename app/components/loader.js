import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const Loader = props => {
    return  (
        <React.Fragment>
            <span className="loader"><FontAwesomeIcon icon={faSpinner} className="fa-spin" />{'  '}{props.text ? text : "Loading..."}</span>
        </React.Fragment>
    );
};

export default Loader;