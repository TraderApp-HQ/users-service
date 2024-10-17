import mongoose, { Schema } from "mongoose";
import { Platform, PlatformActions, TaskCategory, TaskStatus, TaskType } from "../config/enums";
import { ITask } from "../config/interfaces";

interface ITaskModel extends ITask {}

const TaskSchema = new Schema(
	{
		id: { type: String, unique: true },
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

// save _id as id when creating task
TaskSchema.pre("save", function (next) {
	this.id = this._id;
	next();
});

TaskSchema.index({ title: 1, status: 1, category: 1 });

export default mongoose.model<ITaskModel>("Task", TaskSchema);
