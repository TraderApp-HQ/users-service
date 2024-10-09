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
import {
	getCommunityStats,
	getUserReferrals,
	getUserReferralsStats,
	inviteFriends,
} from "../controllers/ReferralController";
import { validateGetReferral, validateInviteFriends } from "../middlewares/ReferralMiddleware";

const router = Router();

router.get(ROUTES.getAllUsers, validateGetAllUsers, getAllUsers);
router.get(ROUTES.getUser, validateGetUser, getUserById);
router.patch(ROUTES.updateUser, validateUpdateUser, updateUserById);
router.patch(ROUTES.toggleuserActivation, validateGetUser, toggleUserActivation);

// Referrals
router.get(ROUTES.referralStats, validateGetReferral, getUserReferralsStats);
router.get(ROUTES.referrals, validateGetReferral, getUserReferrals);
router.post(ROUTES.inviteFriends, validateInviteFriends, inviteFriends);
router.get(ROUTES.communityStats, validateGetReferral, getCommunityStats);

export default router;
