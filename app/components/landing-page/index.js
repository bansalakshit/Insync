import React from "react";

import EarlyAccess from "./early-access"
import Features from "./features"
import Header from "../header"
import Footer from "../footer"

const LandingPage = () => {
	return (
		<React.Fragment>
			<Header />
			<EarlyAccess />
			<Features />
			<Footer />
		</React.Fragment>
	)
}

export default LandingPage;
