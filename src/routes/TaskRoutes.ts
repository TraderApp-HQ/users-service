import { Router } from "express";
import {
	createTask,
	createTaskPlatform,
	createUserTask,
	deleteTask,
	getAllActiveTasks,
	getAllPendingTasks,
	getAllTasks,
	getOnboardingTasks,
	getTask,
	getTaskPlatform,
	getUserTask,
	updateTask,
	updateTaskPlatformData,
} from "../controllers/TaskController";
import {
	validateAdmin,
	validateTaskData,
	validateTaskID,
	validateTaskPlatform,
	validateTaskPlatformsData,
	validateUser,
	validateUserTask,
} from "../middlewares/TaskMiddleware";

const router = Router();

// validates user login session before granting access to the routes
router.use(validateUser);

router.get("/", validateAdmin, getAllTasks);
router.get("/platforms", getTaskPlatform);
router.get("/pending-tasks", getAllPendingTasks);
router.get("/onboarding-tasks", getOnboardingTasks);
router.get("/active-tasks", getAllActiveTasks);
router.get("/user-task/:taskId", getUserTask);
router.get("/:taskId", validateAdmin, getTask);
router.post("/", validateAdmin, validateTaskData, createTask);
router.post("/platforms", validateAdmin, validateTaskPlatform, createTaskPlatform);
router.post("/update-platform-data", validateTaskPlatformsData, updateTaskPlatformData);
router.post("/user-task", validateUserTask, createUserTask);
router.patch("/:taskId", validateAdmin, validateTaskID, validateTaskData, updateTask);
router.delete("/:taskId", validateAdmin, validateTaskID, deleteTask);

export default router;
