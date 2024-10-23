import { Router } from "express";
import {
	createTask,
	createTaskPlatform,
	deleteTask,
	getAllTasks,
	getTask,
	getTaskPlatform,
	updateTask,
} from "../controllers/TaskController";
import {
	validateTaskData,
	validateTaskID,
	validateTaskPlatform,
} from "../middlewares/TaskMiddleware";

const router = Router();

router.get("/", getAllTasks);
router.get("/platforms", getTaskPlatform);
router.get("/:taskId", getTask);
router.post("/", validateTaskPlatform, createTaskPlatform);
router.post("/create-task", validateTaskData, createTask);
router.patch("/:taskId", validateTaskID, validateTaskData, updateTask);
router.delete("/:taskId", validateTaskID, deleteTask);

export default router;
