import React from "react";
import { Nav, NavItem, NavLink } from "reactstrap";

const Menu = props => {

    const view = () => {
        window.open(`/employee?id=${props.userId}`, "_blank");
    }

    return (
        <Nav className="live-page-menu justify-content-end">
            <NavItem>
                <NavLink className="pointer">
                    <img className="notes" src="/static/img/new-design/notes.png" />
                </NavLink>
            </NavItem>
            <NavItem>
                <NavLink className="pointer" onClick={view}>
                    <img src="/static/img/new-design/screen.png" />
                </NavLink>
            </NavItem>
            <NavItem>
                <NavLink className="pointer">
                    <img src="/static/img/new-design/chat.png" />
                </NavLink>
            </NavItem>
            <NavItem>
                <NavLink className="pointer">
                    <img src="/static/img/new-design/video.png" />
                </NavLink>
            </NavItem>
        </Nav>
    );
};

export default Menu;
