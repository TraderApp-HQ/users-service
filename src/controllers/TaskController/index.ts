import { NextFunction, Request, Response } from "express";
import { apiResponseHandler } from "@traderapp/shared-resources";
import TaskPlatform from "../../models/TaskPlatform";
import { checkAdmin } from "../../helpers/middlewares";
import Task from "../../models/Task";
import { RESPONSE_FLAGS } from "../../config/constants";
import { TaskStatus, TaskType } from "../../config/enums";

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

		// modify tasks object to take out _id
		const modifiedTasks = tasks.map((task) => {
			// converts mongoose object to javascript object
			const tasksObject = task.toObject();

			// destructure object to take out _id
			const { _id, ...rest } = tasksObject;

			// return the rest of the object
			return rest;
		});

		res.status(200).json(
			apiResponseHandler({
				object: modifiedTasks,
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
		} = req.body;
		let status;

		// verify task data
		if (
			!title ||
			!description ||
			!taskType ||
			!category ||
			!points ||
			(taskType === TaskType.TIME_BASED && !startDate) ||
			(taskType === TaskType.TIME_BASED && !dueDate)
		) {
			const error: Error = {
				name: RESPONSE_FLAGS.validationError,
				message: "Incomplete task data",
			};
			throw error;
		}

		const currentDate = new Date();
		const stringStartDate = new Date(startDate);
		const stringDueDate = new Date(dueDate);

		// function to set task status
		if (taskType === TaskType.PERMANENT) {
			status = TaskStatus.STARTED;
		}
		if (taskType === TaskType.TIME_BASED && currentDate < stringStartDate) {
			status = TaskStatus.NOT_STARTED;
		}
		if (
			taskType === TaskType.TIME_BASED &&
			currentDate >= stringStartDate &&
			currentDate <= stringDueDate
		) {
			status = TaskStatus.STARTED;
		}
		// if (
		// 	taskType === TaskType.TIME_BASED &&
		// 	currentDate > stringStartDate &&
		// 	currentDate > stringDueDate
		// ) {
		// 	status = TaskStatus.COMPLETED;
		// }

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

		// verify task id
		if (!taskId || !req.body) {
			const error: Error = {
				name: RESPONSE_FLAGS.validationError,
				message: "Invalid task details.",
			};
			throw error;
		}

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
		const task: any = await Task.findById(taskId).populate("platformId");

		// convert to javascript object and destructure _id
		const taskObject = task?.toObject();
		const { _id, ...modifiedTask } = taskObject;

		res.status(201).json(
			apiResponseHandler({
				object: modifiedTask,
			}),
		);
	} catch (error) {
		next(error);
	}
};
