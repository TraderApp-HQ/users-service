import mongoose, { Schema, Document } from "mongoose";
import { OneTimePassword } from "../config/interfaces";
import { OTP_EXPIRES } from "../config/constants";
import { NotificationChannel } from "../config/enums";

interface OneTimePasswordModel extends OneTimePassword, Document {}

const OneTimePasswordSchema = new Schema(
	{
		_id: { type: mongoose.Types.ObjectId, ref: "user" },
		otp: { type: String },
		verificationToken: { type: String },
		channel: { type: String, enum: NotificationChannel, default: NotificationChannel.EMAIL },
		createdAt: { type: Date, default: Date.now },
	},
	{ versionKey: false, timestamps: false },
);

OneTimePasswordSchema.index({ createdAt: 1 }, { expireAfterSeconds: OTP_EXPIRES });

export default mongoose.model<OneTimePasswordModel>("one-time-password", OneTimePasswordSchema);
