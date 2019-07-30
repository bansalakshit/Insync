import React, { useState, useEffect } from "react";
import { Row, Col } from "reactstrap";
import collection from "lodash/collection";
import moment from "moment";

const Timeline = props => {
    const [logs, setLogs] = useState([]);

    let start = moment(moment().format("YYYY-MM-DD 00:00:00"));
    const end = moment(moment().format("YYYY-MM-DD 00:00:00")).add("day", 1);

    const randomInt = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    useEffect(() => {
        let temp = [];
        do {
            temp.push({ 
                time: start.format("ha"), 
                minutes: (collection.sample([true, false])) ? randomInt(0, 60) : 0
            });
            start.add("hour", 1);
        } while (start < end);
        setLogs(temp);
    }, []);

    return (
        <div className="timeline">
            <Row className="m-0">
                {logs.map((log, index) => {
                    return (
                        <Col className="p-0" key={index}>
                            <div className="time-block">
                                {log.time}
                            </div>
                        </Col>
                    );
                })}
            </Row>
        </div>
    );
};

export default Timeline;
