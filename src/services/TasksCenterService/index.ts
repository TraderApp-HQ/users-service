import { Request } from "express";
import { PlatformActions, TaskStatus, UserTaskStatus } from "../../config/enums";
import { ITask, ITaskPlatform, IUserTask } from "../../config/interfaces";
import { checkUser } from "../../helpers/middlewares";
import Task from "../../models/Task";
import TaskPlatform from "../../models/TaskPlatform";
import UserTask from "../../models/UserTask";
import { parse } from "csv-parse/sync";
import AllFollowersRecord from "../../models/AllFollowersRecord";

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

	async updateTaskPlatformData({
		platform,
		platformAction,
		file,
	}: {
		platform: string;
		platformAction: string;
		file: string;
	}) {
		// Strip Data URI prefix if present
		const base64String = file.split(",")[1];

		// Decode base64 to buffer
		const buffer = Buffer.from(base64String, "base64");

		// Convert buffer to string and parse CSV
		let csvText = buffer.toString("utf-8");

		// Strip UTF-8 BOM
		if (csvText.charCodeAt(0) === 0xfeff) {
			csvText = csvText.slice(1);
		}

		// Parse CSV into array of objects using headers
		const records: any[] = parse(csvText, {
			columns: true, // Uses fiest rows as keys
			skip_empty_lines: true,
			trim: true,
			relax_column_count: true, // Allows for empty columns
		});

		// Extract needed followers data and update database
		if (platformAction === PlatformActions.FOLLOW) {
			const extractedData = records.map((record) => ({
				platform,
				userName: record?.userName || record?.Username,
				fullName: record?.fullName || record?.Name,
				avatarUrl: record?.avatarUrl || record?.["Avatar URL"],
				followersCount: Number(record?.Followers || record?.["Followers Count"]),
			}));

			// Delete existing documents for this platform only
			await AllFollowersRecord.deleteMany({ platform });

			// Insert the new documents for this platform
			await AllFollowersRecord.insertMany(extractedData);
		}

		return { message: `Data for ${platform} updated successfully` };
	}
}
