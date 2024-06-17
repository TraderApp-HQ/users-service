import mongoose, { Schema, Document } from "mongoose";
import { ICountry } from "../config/interfaces";

export interface ICountryModel extends ICountry {}

const CountrySchema = new Schema(
	{
		_id: Number,
		name: String,
		code: String,
		flag: String,
		capital: String,
		dial_code: String,
		currency: { name: String, code: String, symbol: String },
		continent: String,
	},
	{ versionKey: false, timestamps: false },
);

export default mongoose.model<ICountryModel>("country", CountrySchema);
