import mongoose, { Schema } from "mongoose";
import { Platform, PlatformActions, TaskCategory } from "../config/enums";
import { TaskPlatform } from "../config/interfaces";

const TaskPlatformSchema = new Schema<TaskPlatform>(
	{
		name: { type: String, enum: Platform, required: true },
		logoUrl: { type: String, required: true },
		isActive: { type: Boolean, required: true },
		supportedActions: {
			type: [String],
			enum: Object.values(PlatformActions),
			required: true,
		},
		categories: {
			type: [String],
			enum: Object.values(TaskCategory),
			required: true,
		},
	},
	{ timestamps: false },
);

export default mongoose.model<TaskPlatform>("TaskPlatform", TaskPlatformSchema);
