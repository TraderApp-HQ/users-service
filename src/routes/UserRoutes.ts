import { Router } from "express";
import {
	getAllUsers,
	getUserById,
	toggleUserActivation,
	updateUserById,
} from "../controllers/UserController";
import { ROUTES } from "../config/constants";
import {
	validateGetAllUsers,
	validateGetUser,
	validateUpdateUser,
} from "../middlewares/UserMiddleware";
import { getUserReferrals } from "../controllers/ReferralController";

const router = Router();

router.get(ROUTES.getAllUsers, validateGetAllUsers, getAllUsers);
router.get(ROUTES.getUser, validateGetUser, getUserById);
router.patch(ROUTES.updateUser, validateUpdateUser, updateUserById);
router.patch(ROUTES.toggleuserActivation, validateGetUser, toggleUserActivation);

// Referrals
router.get(ROUTES.referrals, validateGetUser, getUserReferrals);

export default router;
