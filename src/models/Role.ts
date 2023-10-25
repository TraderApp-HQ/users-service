import mongoose, { Schema } from "mongoose";
import { IRole } from "@/types";

const CountrySchema = new Schema({
    _id: Number,
    description: String
}, { versionKey: false, timestamps: false });

export default mongoose.model<IRole>("role", CountrySchema);