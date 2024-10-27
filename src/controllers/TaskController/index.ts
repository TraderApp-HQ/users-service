import { apiResponseHandler } from "@traderapp/shared-resources";
import { NextFunction, Request, Response } from "express";
import Task from "../../models/Task";
import TaskPlatform from "../../models/TaskPlatform";
import { PAGINATION } from "../../config/constants";
import { TaskStatus, UserTaskStatus } from "../../config/enums";
import UserTask from "../../models/UserTask";
import { checkUser } from "../../helpers/middlewares";

export const createTaskPlatform = async (req: Request, res: Response, next: NextFunction) => {
	try {
		// create new platform
		await TaskPlatform.create(req.body);

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
		const { rows, page, search } = req.query;
		const searchQuery = search ?? "";
		const paginationOptions = {
			page: Number(page) || PAGINATION.PAGE,
			limit: Number(rows) || PAGINATION.LIMIT,
			sort: "-updatedAt",
			select: "-__v -createdAt -updatedAt -_id",
		};
		const queryParams = {
			title: { $regex: searchQuery, $options: "i" },
		};

		// Returns task in max limit of 10
		const paginatedTasks = await Task.paginate(queryParams, paginationOptions);

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
		await Task.create(req.body);

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
		const { taskId } = req.params;

		// Update task
		await Task.findByIdAndUpdate(taskId, req.body, { runValidators: true, new: true });

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
		const task = await Task.findById(taskId)
			.populate("platformId")
			.select("-_id -__v -createdAt -updatedAt");

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
		await Task.findByIdAndDelete(taskId);

		res.status(201).json(
			apiResponseHandler({
				message: "Task deleted successfully.",
			}),
		);
	} catch (error) {
		next(error);
	}
};

export const getAllActiveTasks = async (req: Request, res: Response, next: NextFunction) => {
	try {
		// Get user Id
		const { id } = await checkUser(req);

		const { rows, page, task } = req.query;

		const paginationOptions = {
			page: Number(page) || PAGINATION.PAGE,
			limit: Number(rows) || PAGINATION.LIMIT,
			sort: "-updatedAt",
			select: "id title points taskType dueDate status -_id",
		};
		const queryParams = {
			status: TaskStatus.STARTED,
		};

		const userTaskPaginationOptions = {
			page: Number(page) || PAGINATION.PAGE,
			limit: Number(rows) || PAGINATION.LIMIT,
			sort: "updatedAt",
			select: "id taskId status -_id",
		};

		// this queries th userTask document using the userId and status field.
		const userTaskQueryParams = {
			userId: id,
			...(task === "pending" && { status: UserTaskStatus.IN_REVIEW }),
			...(task === "completed" && { status: UserTaskStatus.DONE }),
		};

		// Returns all active tasks in max limit of 10
		const [paginatedTasks, userTasks] = await Promise.all([
			Task.paginate(queryParams, paginationOptions),
			UserTask.paginate(userTaskQueryParams, userTaskPaginationOptions),
		]);

		res.status(200).json(
			apiResponseHandler({
				object: { allTask: paginatedTasks, userTask: userTasks },
			}),
		);
	} catch (error) {
		next(error);
	}
};

export const createUserTask = async (req: Request, res: Response, next: NextFunction) => {
	try {
		// Create user task
		await UserTask.create(req.body);

		res.status(201).json(
			apiResponseHandler({
				message: "User task successfully added.",
			}),
		);
	} catch (error) {
		next(error);
	}
};

export const getUserTask = async (req: Request, res: Response, next: NextFunction) => {
	try {
		// Get user Id
		const { id } = await checkUser(req);

		const { taskId } = req.params;

		// get task and task status
		const [task, taskStatus] = await Promise.all([
			Task.findById(taskId).populate("platformId").select("-_id -__v -createdAt -updatedAt"),
			UserTask.find({
				userId: id,
				taskId,
			}).select("status -_id"),
		]);

		const modifiedtask = {
			...task?.toObject(),
			status: taskStatus[0] ? taskStatus[0].status : UserTaskStatus.PENDING,
		};

		res.status(201).json(
			apiResponseHandler({
				object: modifiedtask,
			}),
		);
	} catch (error) {
		next(error);
	}
};
