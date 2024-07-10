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

const router = Router();

router.get(ROUTES.getAllUsers, validateGetAllUsers, getAllUsers);
router.get(ROUTES.getUser, validateGetUser, getUserById);
router.patch(ROUTES.updateUser, validateUpdateUser, updateUserById);
router.patch(ROUTES.toggleuserActivation, validateGetUser, toggleUserActivation);

export default router;
