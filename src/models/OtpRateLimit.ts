import mongoose, { Schema, Document } from "mongoose";
import { NotificationChannel } from "../config/enums";
import { OtpRateLimit } from "../config/interfaces";
import { OTP_RATE_LIMIT_EXPIRES } from "../config/constants";

interface OtpRateLimitModel extends OtpRateLimit, Document {}

const OtpRateLimitSchema = new Schema(
	{
		_id: { type: mongoose.Types.ObjectId, ref: "user" },
		channel: { type: String, enum: NotificationChannel, default: NotificationChannel.EMAIL },
		rateLimitStart: { type: Date, default: Date.now },
		attempts: { type: Number, default: 0 },
	},
	{ versionKey: false, timestamps: false },
);

OtpRateLimitSchema.index({ _id: 1, channel: 1 });
OtpRateLimitSchema.index({ rateLimitStart: 1 }, { expireAfterSeconds: OTP_RATE_LIMIT_EXPIRES });

export default mongoose.model<OtpRateLimitModel>("otp-rate-limit", OtpRateLimitSchema);
