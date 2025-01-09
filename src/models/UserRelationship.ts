import mongoose, { Schema, Document, Model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { UserRelationship } from "../config/interfaces";

interface IUserRelationshipModel extends UserRelationship, Document {}

interface UserRelationshipModel extends Model<IUserRelationshipModel> {
	paginate: any;
}

const UserRelationshipSchema = new Schema(
	{
		userId: { type: mongoose.Types.ObjectId, ref: "user" },
		parentId: { type: mongoose.Types.ObjectId, ref: "user" },
		level: { type: Number },
		createdAt: { type: Date, default: Date.now },
	},
	{ versionKey: false, timestamps: false },
);

UserRelationshipSchema.plugin(mongoosePaginate);

UserRelationshipSchema.index({ userId: 1, level: 1 });
UserRelationshipSchema.index({ parentId: 1, level: 1 });

export default mongoose.model<IUserRelationshipModel, UserRelationshipModel>(
	"user-relationship",
	UserRelationshipSchema,
);
