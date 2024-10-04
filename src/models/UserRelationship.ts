import mongoose, { Schema, Document } from "mongoose";
import { UserRelationship } from "../config/interfaces";

interface UserRelationshipModel extends UserRelationship, Document {}

const UserRelationshipSchema = new Schema(
	{
		userId: { type: String },
		parentId: { type: String },
		level: { type: Number },
		createdAt: { type: Date, default: Date.now },
	},
	{ versionKey: false, timestamps: false },
);

export default mongoose.model<UserRelationshipModel>("user-relationship", UserRelationshipSchema);
