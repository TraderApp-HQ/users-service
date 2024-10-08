import mongoose, { Schema, Document } from "mongoose";
import { UserRelationship } from "../config/interfaces";

interface UserRelationshipModel extends UserRelationship, Document {}

const UserRelationshipSchema = new Schema(
	{
		userId: { type: mongoose.Types.ObjectId, ref: "user" },
		parentId: { type: mongoose.Types.ObjectId, ref: "user" },
		level: { type: Number },
		createdAt: { type: Date, default: Date.now },
	},
	{ versionKey: false, timestamps: false },
);

export default mongoose.model<UserRelationshipModel>("user-relationship", UserRelationshipSchema);
