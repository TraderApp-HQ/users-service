import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { RESPONSE_FLAGS } from "../config/constants";
import {
	Platform,
	PlatformActions,
	TaskCategory,
	TaskStatus,
	TaskType,
	UserTaskStatus,
} from "../config/enums";
import { ITask } from "../config/interfaces";
import { checkAdmin, checkUser } from "../helpers/middlewares";

// interface
interface ITaskWithoutStatus extends Omit<ITask, "status"> {}

const taskStatusHandler = (body: ITaskWithoutStatus): ITask => {
	const { taskType, startDate, dueDate } = body;
	let status: TaskStatus = TaskStatus.NOT_STARTED;

	const currentDate = new Date();
	const parsedStartDate = new Date(startDate!);
	const parsedDueDate = new Date(dueDate!);

	// function to set task status
	if (taskType === TaskType.PERMANENT) {
		return { ...body, status: TaskStatus.STARTED };
	}

	if (taskType === TaskType.TIME_BASED) {
		if (currentDate < parsedStartDate) {
			status = TaskStatus.NOT_STARTED;
		} else if (currentDate >= parsedStartDate && currentDate <= parsedDueDate) {
			status = TaskStatus.STARTED;
		} else if (currentDate > parsedDueDate) {
			status = TaskStatus.COMPLETED;
		}
	}

	return { ...body, status };
};

export const validateTaskPlatform = async (req: Request, res: Response, next: NextFunction) => {
	try {
		// validation schema
		const schema = Joi.object({
			id: Joi.string().label("ID"),
			name: Joi.string()
				.valid(...Object.values(Platform))
				.required()
				.label("Name"),
			logoUrl: Joi.string().required().label("Logo URL"),
			isActive: Joi.boolean().required().label("Is Active"),
			supportedActions: Joi.array()
				.min(1)
				.items(Joi.string().valid(...Object.values(PlatformActions)))
				.required()
				.label("Supported actions"),
			categories: Joi.array()
				.min(1)
				.items(Joi.string().valid(...Object.values(TaskCategory)))
				.required()
				.label("Categories"),
		});

		// validate request
		const { error } = schema.validate(req.body);
		if (error) {
			// strip string of double quotes
			error.message = error.message.replace(/\"/g, "");
			throw error;
		}

		next();
	} catch (error) {
		next(error);
	}
};

export const validateTaskData = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const currentDate = new Date();
		currentDate.setHours(0, 0, 0, 0); // Set the time to 00:00:00 to ignore time in the comparison

		// validation schema
		const schema = Joi.object({
			id: Joi.string().label("ID"),
			title: Joi.string().min(5).required().label("Title"),
			description: Joi.string().min(5).required().label("Description"),
			objective: Joi.string().label("Description"),
			taskType: Joi.string()
				.valid(...Object.values(TaskType))
				.required()
				.label("Task type"),
			category: Joi.string()
				.valid(...Object.values(TaskCategory))
				.required()
				.label("Task category"),
			platformId: Joi.string().label("Platform ID"),
			platformName: Joi.string().label("Platform name"),
			link: Joi.string()
				.uri({ scheme: ["http", "https", "www"] })
				.message(
					"{{#label}} must be a valid URL with patttern matching http://, https://, or www://",
				)
				.label("Task link"),
			expectedActions: Joi.array()
				.items(Joi.string().valid(...Object.values(PlatformActions)))
				.label("Expected actions"),
			points: Joi.number().min(0).required().label("Task points"),
			startDate: Joi.date().min(currentDate).label("Start date"),
			dueDate: Joi.date().greater(Joi.ref("startDate")).label("Due date"),
			status: Joi.string()
				.valid(...Object.values(TaskStatus))
				.label("Task status"),
		});

		// validate request
		const { error } = schema.validate(req.body);
		if (error) {
			// strip string of double quotes
			error.message = error.message.replace(/\"/g, "");
			throw error;
		}

		// Attach task status to the request body
		req.body = taskStatusHandler(req.body);

		next();
	} catch (error) {
		next(error);
	}
};

export const validateTaskID = async (req: Request, res: Response, next: NextFunction) => {
	try {
		// verify task id
		const { taskId } = req.params;

		if (!taskId) {
			const error: Error = {
				name: RESPONSE_FLAGS.notfound,
				message: "Invalid task ID.",
			};
			throw error;
		}

		next();
	} catch (error) {
		next(error);
	}
};

export const validateAdmin = async (req: Request, res: Response, next: NextFunction) => {
	try {
		// validates that user is an admin
		await checkAdmin(req);

		next();
	} catch (error) {
		next(error);
	}
};

export const validateUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		// validates that user is registered and validate login session
		await checkUser(req);

		next();
	} catch (error) {
		next(error);
	}
};

export const validateUserTask = async (req: Request, res: Response, next: NextFunction) => {
	try {
		// validation schema
		const schema = Joi.object({
			id: Joi.string().label("ID"),
			userId: Joi.string().required().label("User ID"),
			taskId: Joi.string().required().label("Task ID"),
			taskPoints: Joi.number().min(0).required().label("Task Point"),
			expectedActions: Joi.array()
				.items(Joi.string().valid(...Object.values(PlatformActions)))
				.label("Expected actions"),
			status: Joi.string()
				.valid(...Object.values(UserTaskStatus))
				.required()
				.label("Task Status"),
		});

		// validate request
		const { error } = schema.validate(req.body);
		if (error) {
			// strip string of double quotes
			error.message = error.message.replace(/\"/g, "");
			throw error;
		}

		next();
	} catch (error) {
		next(error);
	}
};

export const validateTaskPlatformsData = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		// validates that user is an admin
		await checkAdmin(req);

		// validation schema for req body
		const schema = Joi.object({
			platform: Joi.string()
				.valid(...Object.values(Platform))
				.required()
				.label("Platform"),
			platformAction: Joi.string()
				.valid(...Object.values(PlatformActions))
				.required()
				.label("Platform Action"),
			file: Joi.string().required().label("File"),
		});

		// validate request body
		const { error } = schema.validate(req.body);
		if (error) {
			// strip string of double quotes
			error.message = error.message.replace(/\"/g, "");
			throw error;
		}

		next();
	} catch (error) {
		next(error);
	}
};
