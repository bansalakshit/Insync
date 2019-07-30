import { Router } from "express";
import login from "./login";
import register from "./register";
import logout from "./logout";
import forgotPassword from "./forgot-password";
import validateResetToken from "./validate-reset-token";
import resetPassword from "./reset-password";
import activate from "./activate";
import google from "./google";

export default () => {

    let router = Router();

	router.use('/google', google());
	router.use('/login', login());
	router.use('/register', register());
	router.use('/logout', logout());
	router.use('/forgot-password', forgotPassword());
	router.use('/validate-reset-token', validateResetToken());
	router.use('/reset-password', resetPassword());
	router.use('/activate', activate());
	
    return router;

}
