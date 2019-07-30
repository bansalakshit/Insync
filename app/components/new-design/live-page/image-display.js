import React, { useEffect, useState } from "react";
import { Row, Col } from "reactstrap";

import ImageViewer from "../../img-viewer";

const ImageDisplay = props => {
    const [height, setHeight] = useState({ height: "0px" });
    const [img, setImg] = useState(null);

    const resize = () => {
        const h = window.innerHeight - 120 - 43;
        setHeight({ height: `${h * 0.5}px` });
    };

    useEffect(() => {
        resize();
        window.addEventListener("resize", resize);
    }, []);

    return (
        <React.Fragment>
            {(() => {
                if (img) {
                    return <ImageViewer callback={setImg} img={img} />;
                }
            })()}
            <div className="image-display" style={height}>
                {(() => {
                    if (props.images.length > 1) {
                        return (
                            <Row className=" m-0">
                                {props.images.map((_img, _index) => {
                                    return (
                                        <Col sm={12 % props.images.length} className="p-0" key={_index}>
                                            <img
                                                className="pointer"
                                                onClick={() => {
                                                    setImg(_img);
                                                }}
                                                alt=""
                                                src={_img}
                                            />
                                        </Col>
                                    );
                                })}
                            </Row>
                        );
                    } else {
                        return (
                            <div className="single">
                                <img
                                    className="pointer"
                                    onClick={() => {
                                        setImg(props.images[0]);
                                    }}
                                    src={props.images.length === 1 ? props.images[0] : "/static/img/no-image-available.png"}
                                    alt=""
                                />
                            </div>
                        );
                    }
                })()}
            </div>
        </React.Fragment>
    );
};

export default ImageDisplay;
