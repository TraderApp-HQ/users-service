import mongoose, { Schema, Document } from "mongoose";
import { ResetToken } from "../types";

interface PasswordResetTokenModel extends ResetToken, Document {}

const PasswordResetTokenSchema = new Schema(
	{
		_id: { type: mongoose.Types.ObjectId, ref: "user" },
		resetToken: { type: String, unique: true },
		expireAt: { type: Date, default: Date.now },
	},
	{ versionKey: false, timestamps: false },
);

PasswordResetTokenSchema.index({ expireAt: 1 }, { expireAfterSeconds: 60 * 2 });

export default mongoose.model<PasswordResetTokenModel>(
	"password-reset-token",
	PasswordResetTokenSchema,
);
