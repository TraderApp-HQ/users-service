import mongoose, { Schema, Document } from "mongoose";
import { RefreshToken } from "../config/interfaces";

interface TokenModel extends RefreshToken, Document {}

const TokenSchema = new Schema(
	{
		_id: { type: mongoose.Types.ObjectId, ref: "user" },
		refreshToken: String,
		expireAt: { type: Date },
	},
	{ versionKey: false, timestamps: false },
);

TokenSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<TokenModel>("refresh-token", TokenSchema);
