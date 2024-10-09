import mongoose, { Schema } from "mongoose";
import { UserTask } from "../config/interfaces";
import { PlatformActions, UserTaskStatus } from "../config/enums";

const UserTaskSchema = new Schema<UserTask>(
	{
		userId: { type: Schema.Types.String, ref: "user", required: true },
		taskId: { type: Schema.Types.String, ref: "Task", required: true },
		taskPoints: { type: Number, required: true, min: 0 },
		expectedActions: { type: [String], required: true, enum: Object.values(PlatformActions) },
		status: { type: String, required: true, enum: Object.values(UserTaskStatus) },
	},
	{ timestamps: false },
);

UserTaskSchema.index({ userId: 1, taskId: 1 }, { unique: true });
UserTaskSchema.index({ status: 1 });

export default mongoose.model<UserTask>("UserTask", UserTaskSchema);
