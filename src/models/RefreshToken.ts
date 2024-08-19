import mongoose, { Schema, Document } from "mongoose";
import { RefreshToken } from "../config/interfaces";
import { REFRESH_TOKEN_EXPIRES } from "../config/constants";

interface TokenModel extends RefreshToken, Document {}

const TokenSchema = new Schema(
	{
		_id: { type: mongoose.Types.ObjectId, ref: "user" },
		refreshToken: String,
		expireAt: { type: Date },
	},
	{ versionKey: false, timestamps: false },
);

// TokenSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });
TokenSchema.index({ expireAt: 1 }, { expireAfterSeconds: REFRESH_TOKEN_EXPIRES });

export default mongoose.model<TokenModel>("refresh-token", TokenSchema);
