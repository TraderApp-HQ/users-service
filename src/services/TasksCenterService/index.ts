import { Request } from "express";
import { TaskStatus, UserTaskStatus } from "../../config/enums";
import { ITask, ITaskPlatform, IUserTask } from "../../config/interfaces";
import { checkUser } from "../../helpers/middlewares";
import Task from "../../models/Task";
import TaskPlatform from "../../models/TaskPlatform";
import UserTask from "../../models/UserTask";

export class TasksCenterService {
	async createTaskPlatform(data: Omit<ITaskPlatform, "id">): Promise<{ message: string }> {
		// create new platform
		await TaskPlatform.create(data);

		return { message: "Platform successfully uploaded" };
	}

	async getTaskPlatforms() {
		// Returns only active platforms
		const taskPlatforms = await TaskPlatform.find({ isActive: true });

		return taskPlatforms;
	}

	async getAllTasks(query: { search?: string }) {
		const { search } = query;
		const searchQuery = search?.trim();
		const tasks = await Task.find(searchQuery ? { title: new RegExp(searchQuery, "i") } : {})
			.sort("-updatedAt")
			.select("-__v -createdAt -updatedAt -_id");

		return tasks;
	}

	async createTask(data: Omit<ITask, "id">): Promise<{ message: string }> {
		// Create task
		await Task.create(data);

		return { message: "Task successfully added." };
	}

	async updateTask(taskId: string, data: Omit<ITask, "id">): Promise<{ message: string }> {
		// Update task
		await Task.findByIdAndUpdate(taskId, data, { runValidators: true, new: true });

		return { message: "Task updated successfully." };
	}

	async getTask(taskId: string) {
		// Get task
		const task = await Task.findById(taskId)
			.populate("platformId")
			.select("-_id -__v -createdAt -updatedAt");

		return task;
	}

	async deleteTask(taskId: string): Promise<{ message: string }> {
		// Delete task
		await Task.findByIdAndDelete(taskId);

		return { message: "Task deleted successfully." };
	}

	async getAllActiveTasks(req: Request) {
		const { id } = await checkUser(req);

		// const { rows, page, task } = req.query;

		// const paginationOptions = {
		// 	...(task === "all" ? { page: Number(page) || PAGINATION.PAGE } : { page: 1 }),
		// 	...(task === "all" ? { limit: Number(rows) || PAGINATION.LIMIT } : { limit: 100 }),
		// 	sort: "-updatedAt",
		// 	select: "id title points taskType dueDate status -_id",
		// };
		// const queryParams = {
		// 	status: TaskStatus.STARTED,
		// };

		// const userTaskPaginationOptions = {
		// 	...(task === "completed" ? { page: Number(page) || PAGINATION.PAGE } : { page: 1 }),
		// 	...(task === "completed"
		// 		? { limit: Number(rows) || PAGINATION.LIMIT }
		// 		: { limit: 100 }),
		// 	sort: "updatedAt",
		// 	select: "id taskId status -_id",
		// };

		// // this queries the userTask document using the userId and status field.
		// const userTaskQueryParams = {
		// 	userId: id,
		// };

		// Returns all active tasks and User tasks.
		const [allActiveTasks, userTasks] = await Promise.all([
			Task.find({ status: TaskStatus.STARTED })
				.sort("-updatedAt")
				.select("id title points taskType dueDate status -_id"),
			UserTask.find({ userId: id }).sort("-updatedAt").select("id taskId status -_id"),
		]);

		return { allActiveTasks, userTasks };
	}

	async getAllPendingTasksCount(req: Request): Promise<number> {
		// Get user Id
		const { id } = await checkUser(req);

		// Get all active tasks and user tasks
		const [Tasks, UserTasks] = await Promise.all([
			Task.find({ status: TaskStatus.STARTED }).select("id -_id"),
			UserTask.find({ userId: id }).select("taskId -_id"),
		]);

		// Get count of only pending tasks
		const count = Tasks.filter(
			(task) => !UserTasks.some((userTask) => userTask.taskId === task.id),
		).length;

		return count;
	}

	async getUserTask(req: Request) {
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

		return modifiedtask;
	}

	async createUserTask(data: Omit<IUserTask, "id">): Promise<{ message: string }> {
		// Create user task
		await UserTask.create(data);

		return { message: "User task successfully added." };
	}
}
