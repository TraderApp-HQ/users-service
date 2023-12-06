import { getCountries } from "../fixtures";
import mongoose from "mongoose";
import "dotenv/config";

async function initCountries() {
	await mongoose
		.connect(process.env.USERS_SERVICE_DB_URL!)
		.then(async () => {
			console.log("Connected to db");
			await getCountries();
			console.log("Countries were initialized successfully!");
		})
		.catch((err) => {
			console.error(`Failed to connect to db. Error: ${err.message}`);
		});

	await mongoose.disconnect();
}

initCountries();
