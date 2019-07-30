import React from "react";
import Layout from "../components/layout";
import Login from "../components/login";
import { Row } from "reactstrap";

const LoginPage = props => {
	return (
		<Layout>
			<Row className="page-content login">
				<Login />
			</Row>
		</Layout>
	);
};

export default LoginPage;
