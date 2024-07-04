import { Router } from "express";
import {
	signupHandler,
	loginHandler,
	refreshTokenHandler,
	logoutHandler,
	passwordResetHandler,
	sendPasswordResetLinkHandler,
	verifyOtpHandler,
} from "../controllers/AuthController";
import {
	validateSignupRequest,
	validateLoginRequest,
	validateRefreshTokenRequest,
	validateLogoutRequest,
	validateSendPasswordResetLinkRequest,
	validatePasswordResetRequest,
	validateVerifyOTPRequest,
} from "../middlewares/AuthMiddleware";
import { ROUTES } from "../config/constants";

const router = Router();

router.post(ROUTES.signup, validateSignupRequest, signupHandler);
router.post(ROUTES.login, validateLoginRequest, loginHandler);
router.delete(ROUTES.logout, validateLogoutRequest, logoutHandler);
router.post(ROUTES.refreshToken, validateRefreshTokenRequest, refreshTokenHandler);
router.post(ROUTES.passwordReset, validatePasswordResetRequest, passwordResetHandler);
router.post(
	ROUTES.passwordResetLink,
	validateSendPasswordResetLinkRequest,
	sendPasswordResetLinkHandler,
);
router.put(ROUTES.verifyOtp, validateVerifyOTPRequest, verifyOtpHandler);

export default router;
