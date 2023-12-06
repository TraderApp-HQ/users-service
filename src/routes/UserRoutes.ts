import { Router } from "express";
import {
	getAllUsers,
	getUserById,
	updateUserById,
	searchUser,
} from "../controllers/UserController";
import { ROUTES } from "../config/constants";
import {
	validateGetAllUsers,
	validateGetUser,
	validateUpdateUser,
	validateSearchUser,
} from "../middlewares/UserMiddleware";

const router = Router();

router.get(ROUTES.get_all_users, validateGetAllUsers, getAllUsers);
router.get(ROUTES.get_user, validateGetUser, getUserById);
router.patch(ROUTES.update_user, validateUpdateUser, updateUserById);
router.post(ROUTES.search_user, validateSearchUser, searchUser);

export default router;
