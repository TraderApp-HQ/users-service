import mongoose, { Schema } from "mongoose";
import { Platform, PlatformActions, TaskCategory } from "../config/enums";
import { ITaskPlatform } from "../config/interfaces";

interface ITaskPlatformModel extends ITaskPlatform {}

const TaskPlatformSchema = new Schema(
	{
		id: { type: String, unique: true },
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

export default mongoose.model<ITaskPlatformModel>("TaskPlatform", TaskPlatformSchema);