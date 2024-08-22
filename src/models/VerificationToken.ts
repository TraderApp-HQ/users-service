import mongoose, { Schema, Document } from "mongoose";
import { VerificationToken } from "../config/interfaces";
import { VERIFICATION_TOKEN_EXPIRES } from "../config/constants";

interface VerificationTokenModel extends VerificationToken, Document {}

const VerificationTokenSchema = new Schema(
	{
		_id: { type: mongoose.Types.ObjectId, ref: "user" },
		verificationToken: { type: String, unique: true },
		expireAt: { type: Date, default: Date.now },
	},
	{ versionKey: false, timestamps: false },
);

VerificationTokenSchema.index({ expireAt: 1 }, { expireAfterSeconds: VERIFICATION_TOKEN_EXPIRES });

export default mongoose.model<VerificationTokenModel>(
	"verification-token",
	VerificationTokenSchema,
);
