import { Router } from "express";
import { getAllUsers, getUserById, updateUserById } from "../controllers/UserController";
import { ROUTES } from "../config/constants";

const router = Router();

router.get(ROUTES.get_all_users, getAllUsers);
router.get(ROUTES.get_user, getUserById);
router.patch(ROUTES.update_user, updateUserById);

export default router;
