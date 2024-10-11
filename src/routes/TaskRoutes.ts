import { Router } from "express";
import {
	createTask,
	createTaskPlatform,
	getAllTasks,
	getTask,
	getTaskPlatform,
	updateTask,
} from "../controllers/TaskController";

const router = Router();

router.get("/", getAllTasks);
router.get("/platforms", getTaskPlatform);
router.get("/:taskId", getTask);
router.post("/", createTaskPlatform);
router.post("/create-task", createTask);
router.patch("/:taskId", updateTask);

export default router;
