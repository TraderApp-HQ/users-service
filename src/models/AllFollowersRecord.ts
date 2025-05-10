import mongoose, { Schema } from "mongoose";
import { Platform } from "../config/enums";
import { IAllFollowersRecord } from "../config/interfaces";

interface IAllFollowersRecordSchema extends IAllFollowersRecord {}

const AllFollowersRecordSchema = new Schema(
	{
		id: { type: String, unique: true },
		platform: { type: String, enum: Object.values(Platform), required: true, index: true },
		username: { type: String, unique: true, required: true },
		fullName: { type: String },
		avatarUrl: { type: String },
		followersCount: { type: Number },
	},
	{ timestamps: false },
);

// saves _id as id when creating platform follower
AllFollowersRecordSchema.pre("save", function (next) {
	this.id = this._id;
	next();
});

export default mongoose.model<IAllFollowersRecordSchema>(
	"all-followers-record",
	AllFollowersRecordSchema,
);
