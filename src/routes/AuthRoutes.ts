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
	sendOtpHandler,
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
	validateSendOtpRequest,
} from "../middlewares/AuthMiddleware";
import { ROUTES } from "../config/constants";

const router = Router();

router.post(ROUTES.signup, validateSignupRequest, signupHandler);
router.post(ROUTES.createUser, validateCreateUserRequest, createUserHandler);
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
router.post(ROUTES.sendOtp, validateSendOtpRequest, sendOtpHandler);

export default router;
