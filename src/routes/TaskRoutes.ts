import { Router } from "express";
import {
	createTask,
	createTaskPlatform,
	createUserTask,
	deleteTask,
	getAllActiveTasks,
	getAllTasks,
	getTask,
	getTaskPlatform,
	getUserTask,
	updateTask,
} from "../controllers/TaskController";
import {
	validateAdmin,
	validateTaskData,
	validateTaskID,
	validateTaskPlatform,
	validateUser,
	validateUserTask,
} from "../middlewares/TaskMiddleware";

const router = Router();

// validates user login session before granting access to the routes
router.use(validateUser);

router.get("/", validateAdmin, getAllTasks);
router.get("/platforms", getTaskPlatform);
router.get("/active-tasks", getAllActiveTasks);
router.get("/user-task/:taskId", getUserTask);
router.get("/:taskId", validateAdmin, getTask);
router.post("/", validateAdmin, validateTaskData, createTask);
router.post("/platforms", validateAdmin, validateTaskPlatform, createTaskPlatform);
router.post("/user-task", validateUserTask, createUserTask);
router.patch("/:taskId", validateAdmin, validateTaskID, validateTaskData, updateTask);
router.delete("/:taskId", validateAdmin, validateTaskID, deleteTask);

export default router;
