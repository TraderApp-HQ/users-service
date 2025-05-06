import mongoose, { Schema } from "mongoose";
import { Platform, PlatformFollowStatus } from "../config/enums";
import { IPlatformsFollower } from "../config/interfaces";

interface IPlatformsFollowerModel extends IPlatformsFollower {}

const PlatformsFollowerSchema = new Schema(
	{
		id: { type: String, unique: true },
		userId: { type: String, required: true, ref: "user" },
		platformName: { type: String, enum: Object.values(Platform), required: true },
		username: { type: String, unique: true, required: true },
		followStatus: {
			type: String,
			default: PlatformFollowStatus.NOT_FOLLOWING,
			enum: Object.values(PlatformFollowStatus),
		},
		fullName: { type: String },
		avatarUrl: { type: String },
		followersCount: { type: Number },
	},
	{ timestamps: false },
);

// saves _id as id when creating platform follower
PlatformsFollowerSchema.pre("save", function (next) {
	this.id = this._id;
	next();
});

export default mongoose.model<IPlatformsFollowerModel>(
	"platforms-follower",
	PlatformsFollowerSchema,
);
