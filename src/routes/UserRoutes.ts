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
	getReferralOverview,
	getUserReferrals,
	getUserReferralsStats,
	inviteFriends,
	sendUserReferralProfileToQueue,
} from "../controllers/ReferralController";
import { validateGetReferral, validateInviteFriends } from "../middlewares/ReferralMiddleware";
import { validateAdmin } from "../middlewares/TaskMiddleware";

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
router.get(ROUTES.referralOverview, validateGetReferral, getReferralOverview);
router.post(ROUTES.trackReferrals, validateAdmin, sendUserReferralProfileToQueue);

export default router;
