import { Router } from "express";
import { 
    signupHandler, 
    loginHandler, 
    refreshTokenHandler,
    logoutHandler,
    passwordResetHandler,
    sendPasswordResetLinkHandler 
} from "../controllers/AuthController";
import { 
    validateSignupRequest, 
    validateLoginRequest, 
    validateRefreshTokenRequest,
    validateLogoutRequest,
    validateSendPasswordResetLinkRequest,
    validatePasswordResetRequest
} from "../middlewares/AuthMiddleware"; 
import { ROUTES } from "~/config/constants";

const router = Router();

router.post(ROUTES.signup, validateSignupRequest, signupHandler);
router.post(ROUTES.login, validateLoginRequest, loginHandler);
router.delete(ROUTES.logout, validateLogoutRequest, logoutHandler);
router.post(ROUTES.refresh_token, validateRefreshTokenRequest, refreshTokenHandler);
router.post(ROUTES.password_reset, validatePasswordResetRequest, passwordResetHandler);
router.get(ROUTES.password_reset_link, validateSendPasswordResetLinkRequest, sendPasswordResetLinkHandler);

export default router;