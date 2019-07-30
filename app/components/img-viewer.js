import React, { useEffect } from "react";

const ImageViewer = props => {
    const openFullscreen = () => {
        let elem = document.getElementById("image-viewer");
        if (elem) {
            if (elem.requestFullscreen) {
                elem.requestFullscreen()
                    .then({})
                    .catch(_err => {});
            } else if (elem.mozRequestFullScreen) {
                elem.mozRequestFullScreen()
                    .then({})
                    .catch(_err => {});
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen()
                    .then({})
                    .catch(_err => {});
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen()
                    .then({})
                    .catch(_err => {});
            }
        }
    };

    useEffect(() => {
        openFullscreen();
        let exitHandler = () => {
            if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
                if (props.callback) props.callback(null);
            }
        };
        document.addEventListener("fullscreenchange", exitHandler);
        document.addEventListener("webkitfullscreenchange", exitHandler);
        document.addEventListener("mozfullscreenchange", exitHandler);
        document.addEventListener("MSFullscreenChange", exitHandler);
    });

    return (
        <div id="image-viewer">
            <img style={{ width: "100%" }} src={props.img} />
        </div>
    );
};

export default ImageViewer;
