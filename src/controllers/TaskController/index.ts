import { apiResponseHandler } from "@traderapp/shared-resources";
import { NextFunction, Request, Response } from "express";
import Task from "../../models/Task";
import TaskPlatform from "../../models/TaskPlatform";

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
