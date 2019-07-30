import React from "react";
import { Container, Navbar, Nav, NavItem, NavLink } from "reactstrap";
import Link from "next/link";

const Footer = props => {
	return (
		<Container fluid className="footer">
			<Container>
				<Navbar color="light" light expand="md">
					<div className="navbar-brand">
						<Link prefetch href="/">
							<a>
								<img src="/static/img/logo.png" />
							</a>
						</Link>
					</div>

					<Nav className="ml-auto" navbar>
						<NavItem>
							<Link href="/privacy-policy">
								<NavLink>Privacy Policy</NavLink>
							</Link>
						</NavItem>
						<NavItem>
							<Link href="/terms-of-use">
								<NavLink>Terms of Use</NavLink>
							</Link>
						</NavItem>
					</Nav>
				</Navbar>
			</Container>
		</Container>
	);
};

export default Footer;
