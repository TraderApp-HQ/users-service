import { Router } from "express";
import {
	signupHandler,
	loginHandler,
	refreshTokenHandler,
	logoutHandler,
	passwordResetHandler,
	sendPasswordResetLinkHandler,
	verifyOtpHandler,
	createUserHandler,
} from "../controllers/AuthController";
import {
	validateSignupRequest,
	validateLoginRequest,
	validateRefreshTokenRequest,
	validateLogoutRequest,
	validateSendPasswordResetLinkRequest,
	validatePasswordResetRequest,
	validateVerifyOTPRequest,
	validateCreateUserRequest,
} from "../middlewares/AuthMiddleware";
import { ROUTES } from "../config/constants";

const router = Router();

router.post(ROUTES.signup, validateSignupRequest, signupHandler);
router.post(ROUTES.createUser, validateCreateUserRequest, createUserHandler);
router.post(ROUTES.login, validateLoginRequest, loginHandler);
router.delete(ROUTES.logout, validateLogoutRequest, logoutHandler);
router.post(ROUTES.refreshToken, validateRefreshTokenRequest, refreshTokenHandler);
router.post(ROUTES.passwordReset, validatePasswordResetRequest, passwordResetHandler);
router.get(
	ROUTES.passwordResetLink,
	validateSendPasswordResetLinkRequest,
	sendPasswordResetLinkHandler,
);
router.put(ROUTES.verifyOtp, validateVerifyOTPRequest, verifyOtpHandler);

export default router;
