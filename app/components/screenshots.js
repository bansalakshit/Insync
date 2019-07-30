import React, { useState, useEffect } from "react";
import { Row, Col, Card, CardHeader, CardFooter, CardBody } from "reactstrap";
import moment from "moment";
import ScreenshotCarousel from "../components/screenshot-carousel";

const Screenshots = props => {
    const [carousel, setCarousel] = useState(false);
    const [active, setActive] = useState("");

    const escFunction = _event => {
        if (_event.keyCode === 27) {
            setCarousel(false);
            setActive("");
        }
    };

    const showCarousel = _img => {
        setCarousel(true);
        setActive(_img);
    };

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);

        () => {
            document.removeEventListener("keydown", escFunction, false);
        };
    }, []);

    return (
        <Row className="page-screenshots">
            {(() => {
                if (props.screenshots) {
                    return (
                        <React.Fragment>
                            {(() => {
                                if (carousel) return <ScreenshotCarousel items={props.screenshots} active={active} />;
                            })()}
                            <Col sm="12">
                                <Row className="items">
                                    {(() => {
                                        if (props.screenshots && props.screenshots.length > 0) {
                                            return props.screenshots.map(screenshot => {
                                                return (
                                                    <Col className="item mb-3" sm="12" lg="4" key={screenshot._id}>
                                                        <Card>
                                                            <CardHeader>{moment(screenshot.start).format("LLL")}</CardHeader>
                                                            <CardBody>
                                                                {(() => {
                                                                    if (screenshot.screenshots.length > 0) {
                                                                        return screenshot.screenshots.map(img => {
                                                                            return (
                                                                                <img
                                                                                    className="pointer"
                                                                                    onClick={() => {
                                                                                        showCarousel(img);
                                                                                    }}
                                                                                    key={img}
                                                                                    src={img}
                                                                                />
                                                                            );
                                                                        });
                                                                    } else {
                                                                        return <img src="/static/img/no-image-available.png" />;
                                                                    }
                                                                })()}
                                                            </CardBody>
                                                            <CardFooter>
                                                                {screenshot.job.title} - {screenshot.task ? screenshot.task : "No Task"}
                                                            </CardFooter>
                                                        </Card>
                                                    </Col>
                                                );
                                            });
                                        } else {
                                            return <Col sm="12" lg="12" className="text-center">
                                                        No screenshots yet.
                                                    </Col>;
                                        }
                                    })()}
                                </Row>
                            </Col>
                        </React.Fragment>
                    );
                }
            })()}
        </Row>
    );
};

export default Screenshots;
