import { apiResponseHandler } from "@traderapp/shared-resources";
import { NextFunction, Request, Response } from "express";
import { TasksCenterService } from "../../services/TasksCenterService";

export const createTaskPlatform = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const tasksCenterService = new TasksCenterService();
		const response = await tasksCenterService.createTaskPlatform(req.body);

		res.status(201).json(
			apiResponseHandler({
				message: response.message,
			}),
		);
	} catch (error) {
		next(error);
	}
};

export const getTaskPlatform = async (req: Request, res: Response, next: NextFunction) => {
	try {
		// Returns only active platforms
		const tasksCenterService = new TasksCenterService();
		const taskPlatforms = await tasksCenterService.getTaskPlatforms();

		res.status(200).json(
			apiResponseHandler({
				object: taskPlatforms,
			}),
		);
	} catch (error) {
		next(error);
	}
};

export const getAllTasks = async (req: Request, res: Response, next: NextFunction) => {
	try {
		// Returns task in max limit of 10
		const tasksCenterService = new TasksCenterService();
		const paginatedTasks = await tasksCenterService.getAllTasks(req.query);

		res.status(200).json(
			apiResponseHandler({
				object: paginatedTasks,
			}),
		);
	} catch (error) {
		next(error);
	}
};

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
	try {
		// Create task
		const tasksCenterService = new TasksCenterService();
		const response = await tasksCenterService.createTask(req.body);

		res.status(201).json(
			apiResponseHandler({
				message: response.message,
			}),
		);
	} catch (error) {
		next(error);
	}
};

export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { taskId } = req.params;

		// Update task
		const tasksCenterService = new TasksCenterService();
		const response = await tasksCenterService.updateTask(taskId, req.body);

		res.status(201).json(
			apiResponseHandler({
				message: response.message,
			}),
		);
	} catch (error) {
		next(error);
	}
};

export const getTask = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { taskId } = req.params;

		// Get task
		const tasksCenterService = new TasksCenterService();
		const task = await tasksCenterService.getTask(taskId);

		res.status(201).json(
			apiResponseHandler({
				object: task,
			}),
		);
	} catch (error) {
		next(error);
	}
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { taskId } = req.params;

		// Delete task
		const tasksCenterService = new TasksCenterService();
		const response = await tasksCenterService.deleteTask(taskId);

		res.status(201).json(
			apiResponseHandler({
				message: response.message,
			}),
		);
	} catch (error) {
		next(error);
	}
};

export const getAllActiveTasks = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const tasksCenterService = new TasksCenterService();
		const { allActiveTasks, userTasks } = await tasksCenterService.getAllActiveTasks(req);

		res.status(200).json(
			apiResponseHandler({
				object: { allTask: allActiveTasks, userTask: userTasks },
			}),
		);
	} catch (error) {
		next(error);
	}
};
export const getAllPendingTasksCount = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const tasksCenterService = new TasksCenterService();
		const count = await tasksCenterService.getAllPendingTasksCount(req);

		res.status(200).json(
			apiResponseHandler({
				object: { pendingTasksCount: count },
			}),
		);
	} catch (error) {
		next(error);
	}
};

export const createUserTask = async (req: Request, res: Response, next: NextFunction) => {
	try {
		// Create user task
		const tasksCenterService = new TasksCenterService();
		const response = await tasksCenterService.createUserTask(req.body);
		// await UserTask.create(req.body);

		res.status(201).json(
			apiResponseHandler({
				message: response.message,
			}),
		);
	} catch (error) {
		next(error);
	}
};

export const getUserTask = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const tasksCenterService = new TasksCenterService();
		const modifiedtask = await tasksCenterService.getUserTask(req);

		res.status(201).json(
			apiResponseHandler({
				object: modifiedtask,
			}),
		);
	} catch (error) {
		next(error);
	}
};

export const updateTaskPlatformData = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { platform, platformAction, file } = req.body;

		const tasksCenterService = new TasksCenterService();
		const response = await tasksCenterService.updateTaskPlatformData({
			platform,
			platformAction,
			file,
		});

		res.status(201).json(
			apiResponseHandler({
				message: response.message,
			}),
		);
	} catch (error) {
		next(error);
	}
};
