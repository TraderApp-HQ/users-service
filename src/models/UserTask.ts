import mongoose, { Model, Schema } from "mongoose";
import { PlatformActions, UserTaskStatus } from "../config/enums";
import { IUserTask } from "../config/interfaces";
import paginate from "mongoose-paginate-v2";

interface IUserTaskModel extends IUserTask {}

interface PUserTaskModel extends Model<IUserTaskModel> {
	paginate: any;
}

const UserTaskSchema = new Schema(
	{
		id: { type: String, unique: true },
		userId: { type: Schema.Types.String, ref: "user", required: true },
		taskId: { type: Schema.Types.String, ref: "Task", required: true },
		taskPoints: { type: Number, required: true, min: 0 },
		expectedActions: { type: [String], enum: Object.values(PlatformActions) },
		status: { type: String, required: true, enum: Object.values(UserTaskStatus) },
	},
	{ timestamps: true },
);

UserTaskSchema.plugin(paginate);
// saves _id as id when creating user task
UserTaskSchema.pre("save", function (next) {
	this.id = this._id;
	next();
});

UserTaskSchema.index({ userId: 1, taskId: 1 }, { unique: true });
UserTaskSchema.index({ status: 1 });

export default mongoose.model<IUserTaskModel, PUserTaskModel>("UserTask", UserTaskSchema);
