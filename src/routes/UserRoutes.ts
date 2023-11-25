import { Router } from "express";
import { getAllUsers, getUserById, updateUserById } from "../controllers/UserController";
import { ROUTES } from "../config/constants";
import {
	validateGetAllUsers,
	validateGetUser,
	validateUpdateUser,
} from "~/middlewares/UserMiddleware";

const router = Router();

router.get(ROUTES.get_all_users, validateGetAllUsers, getAllUsers);
router.get(ROUTES.get_user, validateGetUser, getUserById);
router.patch(ROUTES.update_user, validateUpdateUser, updateUserById);

export default router;
