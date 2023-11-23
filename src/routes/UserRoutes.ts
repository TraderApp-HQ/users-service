import { Router } from "express";
import { getAllUsers, getUserById, updateUserById } from "../middlewares/UserMiddleware";
import { ROUTES } from "../config/constants";

const router = Router();

router.post(ROUTES.get_all_users, getAllUsers);
router.get(ROUTES.get_user, getUserById);
router.post(ROUTES.update_user, updateUserById);

export default router;
