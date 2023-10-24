import { Router } from "express";
import {
    sendEmailVerificationCodeHandler,
    sendPhoneVerificationCodeHandler,
    confirmEmailVerificationCodeHandler,
    confirmPhoneVerificationCodeHandler
} from "@/controllers/VerificationController";

const router = Router();

router.get("/email", sendEmailVerificationCodeHandler);
router.get("/phone", sendPhoneVerificationCodeHandler);
router.post("/email", confirmEmailVerificationCodeHandler);
router.post("/phone", confirmPhoneVerificationCodeHandler);

export default router;