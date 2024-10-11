import { NextFunction, Request, Response } from "express";
import { apiResponseHandler } from "@traderapp/shared-resources";
import TaskPlatform from "../../models/TaskPlatform";
import { checkAdmin } from "../../helpers/middlewares";
import Task from "../../models/Task";

export const createTaskPlatform = async (req: Request, res: Response, next: NextFunction) => {
	try {
		// Ensures only Admin can create a new task platform
		await checkAdmin(req);

		const { name, logoUrl, isActive, supportedActions, categories } = req.body;

		// verify req.body
		if (!name || !logoUrl || !isActive || !supportedActions || !categories) {
			throw new Error("Incomplete platform data.");
		}

		// create new platform
		await TaskPlatform.create({
			name,
			logoUrl,
			isActive,
			supportedActions,
			categories,
		});

		res.status(201).json(
			apiResponseHandler({
				message: "Platform successfully uploaded",
			}),
		);
	} catch (error) {
		next(error);
	}
};

export const getTaskPlatform = async (req: Request, res: Response, next: NextFunction) => {
	try {
		// Returns only active platforms
		const taskPlatforms = await TaskPlatform.find({ isActive: true });

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
		// Returns only active platforms
		const tasks = await Task.find();

		res.status(200).json(
			apiResponseHandler({
				object: tasks,
			}),
		);
	} catch (error) {
		next(error);
	}
};

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
	try {
		// Ensures only Admin can create a new task
		await checkAdmin(req);

		const {
			title,
			description,
			objective,
			taskType,
			category,
			platformId,
			platformName,
			link,
			expectedActions,
			points,
			startDate,
			dueDate,
			status,
		} = req.body;

		// verify task data
		if (!title || !description || !taskType || !category || !points || !status) {
			throw new Error("Incomplete task data");
		}

		// Create task
		await Task.create({
			title,
			description,
			objective,
			taskType,
			category,
			platformId,
			platformName,
			link,
			expectedActions,
			points,
			startDate,
			dueDate,
			status,
		});

		res.status(201).json(
			apiResponseHandler({
				message: "Task successfully added.",
			}),
		);
	} catch (error) {
		next(error);
	}
};

export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
	try {
		// Ensures only Admin can create a new task
		await checkAdmin(req);

		const { taskId } = req.params;

		// Update task
		await Task.findByIdAndUpdate(taskId, { ...req.body }, { runValidators: true });

		res.status(201).json(
			apiResponseHandler({
				message: "Task updated successfully.",
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
		const task = await Task.findById(taskId).populate("platformId");

		res.status(201).json(
			apiResponseHandler({
				object: task,
			}),
		);
	} catch (error) {
		next(error);
	}
};
