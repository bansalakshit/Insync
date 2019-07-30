import React, { useState , useEffect} from "react";
import { connect } from "react-redux";

import Layout from "../components/layout";
import ManagerDashboard from "../components/manager-dashboard/index";
import LandingPage from "../components/landing-page/index";

const HomePage = ({loggedIn}) => {
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		setLoaded(true);
	}, []);

	return (
		<React.Fragment>
			{loaded && loggedIn && <Layout>
				<ManagerDashboard />
			</Layout>}
			{loaded && !loggedIn && <Layout>
				<LandingPage />
			</Layout>}
		</React.Fragment>
	)
}

function mapStateToProps(state) {
	const { loggedIn } = state.authentication;
	return {
		loggedIn
	};
}

export default connect(mapStateToProps)(HomePage)
