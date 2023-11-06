import mongoose, { Schema, Document } from "mongoose";
import { RefreshToken } from "../types";

interface TokenModel extends RefreshToken, Document {};

const TokenSchema = new Schema({
    _id: { type: mongoose.Types.ObjectId, ref: "user" },
    refresh_token: String,
    expireAt: { type: Date }
}, { versionKey: false, timestamps: false });

TokenSchema.index( { "expireAt": 1 }, { expireAfterSeconds: 0 } );

export default mongoose.model<TokenModel>("refresh-token", TokenSchema);