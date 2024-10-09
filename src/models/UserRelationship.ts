import mongoose, { Schema, Document, Model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { UserRelationship } from "../config/interfaces";

interface IUserRelationshipModel extends UserRelationship, Document {}

interface UserRelationshipModel extends Model<IUserRelationshipModel> {
	paginate: any;
}

const UserRelationshipSchema = new Schema(
	{
		user: { type: mongoose.Types.ObjectId, ref: "user" },
		parent: { type: mongoose.Types.ObjectId, ref: "user" },
		level: { type: Number },
		createdAt: { type: Date, default: Date.now },
	},
	{ versionKey: false, timestamps: false },
);

UserRelationshipSchema.plugin(mongoosePaginate);

export default mongoose.model<IUserRelationshipModel, UserRelationshipModel>(
	"user-relationship",
	UserRelationshipSchema,
);
