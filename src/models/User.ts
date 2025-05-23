/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import mongoose, { Document, Schema, Model, PaginateResult, PaginateOptions } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import bcrypt from "bcrypt";
import { IUser } from "../config/interfaces";
import { Role, Status } from "../config/enums";
import { ErrorMessage, ReferralRank } from "../config/constants";

export interface IUserModel extends IUser, Document {}

interface UserModel extends Model<IUserModel> {
	login: (email: string, password: string) => Promise<IUserModel>;
	paginate: (query?: object, options?: PaginateOptions) => Promise<PaginateResult<IUserModel>>;
}

const UserSchema = new Schema(
	{
		id: { type: String, unique: true },
		email: { type: String, required: true, unique: true, index: { unique: true } },
		password: { type: String, required: true },
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		phone: { type: String, default: "" },
		dob: { type: String },
		countryId: { type: Number, required: true, ref: "country" },
		countryName: { type: String, required: false },
		referralRank: {
			type: String,
			enum: [...Object.values(ReferralRank), null],
			default: null,
			index: true,
		},
		isEmailVerified: { type: Boolean, default: false },
		isPhoneVerified: { type: Boolean, default: false },
		isIdVerified: { type: Boolean, default: false },
		role: { type: [String], enum: Role, default: [Role.USER] },
		status: { type: String, default: Status.ACTIVE, index: true },
		referralCode: { type: String, index: true, unique: true, sparse: true },
		parentId: { type: String, index: true, ref: "user" },
		personalATC: { type: Number, default: 0 },
		communityATC: { type: Number, default: 0 },
		isTestReferralTrackingInProgress: { type: Boolean, default: false },
	},
	{ versionKey: false, timestamps: true },
);

UserSchema.plugin(mongoosePaginate);
UserSchema.pre("save", async function (next) {
	try {
		const salt = await bcrypt.genSalt(10);
		const tempPass = this.password || "";
		this.password = (await bcrypt.hash(tempPass, salt)) as unknown as string;
		this.id = this._id;
		next();
	} catch (err: any) {
		next(err);
	}
});

UserSchema.statics.login = async function (email, password) {
	const user: IUserModel = await this.findOne({ email });

	if (user) {
		if (user.status === Status.INACTIVE) {
			const error = new Error(ErrorMessage.DEACTIVATED);
			error.name = ErrorMessage.NOTFOUND;
			throw error;
		}
		const isPasswordCorrect = await bcrypt.compare(password, user.password);

		if (isPasswordCorrect) return user;

		return null;
	}

	return null;
};

export default mongoose.model<IUserModel, UserModel>("user", UserSchema);
