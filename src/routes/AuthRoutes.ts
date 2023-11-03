import { Router } from "express";
import { 
    signupHandler, 
    loginHandler, 
    refreshTokenHandler,
    logoutHandler,
    passwordResetHandler,
    sendPasswordResetLinkHandler 
} from "@/controllers/AuthController";
import { 
    validateSignupRequest, 
    validateLoginRequest, 
    validateRefreshTokenRequest,
    validateLogoutRequest,
    validateSendPasswordResetLinkRequest,
    validatePasswordResetRequest
} from "@/middlewares/AuthMiddleware"; 
const router = Router();

 /**
 * @swagger
 * '/auth/login':
 *  post:
 *    tags:
 *      - Login
 *    summary: Login User
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/CreateLoginInput'
 *    description: Returns all items
 *    responses:
 *      200:
 *        description: Success
 *        content: 
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CreateLoginResponse'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad Request
 */
router.post("/signup", validateSignupRequest, signupHandler);


router.post("/login", validateLoginRequest, loginHandler);
router.delete("/logout", validateLogoutRequest, logoutHandler);
router.post("/refresh-token", validateRefreshTokenRequest, refreshTokenHandler);
router.post("/password-reset", validatePasswordResetRequest, passwordResetHandler);
router.get("/password-reset/:email", validateSendPasswordResetLinkRequest, sendPasswordResetLinkHandler);

export default router;