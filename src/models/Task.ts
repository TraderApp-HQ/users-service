import mongoose, { Schema } from "mongoose";
import { Platform, PlatformActions, TaskCategory, TaskStatus, TaskType } from "../config/enums";
import { Task } from "../config/interfaces";

const TaskSchema = new Schema<Task>(
	{
		title: { type: String, required: true },
		description: { type: String, required: true },
		objective: { type: String },
		taskType: { type: String, required: true, enum: Object.values(TaskType) },
		category: { type: String, required: true, enum: Object.values(TaskCategory) },
		platformId: {
			type: Schema.Types.String,
			ref: "TaskPlatform",
		},
		platformName: { type: String, enum: Object.values(Platform) },
		link: { type: String },
		expectedActions: { type: [String], enum: Object.values(PlatformActions) },
		points: { type: Number, required: true, min: 0 },
		startDate: { type: Date },
		dueDate: { type: Date },
		status: { type: String, enum: Object.values(TaskStatus), required: true },
	},
	{ timestamps: false },
);

TaskSchema.index({ title: 1, status: 1, category: 1 });

export default mongoose.model<Task>("Task", TaskSchema);
