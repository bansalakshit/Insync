import React from "react";
import { Container } from "reactstrap";

import AlertMessage from "./alert";
import Header from "./header";

const Layout = props => {
	const { children } = props;

	return (
		<React.Fragment>
			<Header />
			<Container>
				<AlertMessage />
				{children}
			</Container>
		</React.Fragment>
	);
};

export default Layout;
