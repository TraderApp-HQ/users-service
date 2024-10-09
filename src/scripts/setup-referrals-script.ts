import mongoose from "mongoose";
import "dotenv/config";

import User from "../models/User";
import { generateReferralCode } from "../utils/generateReferralCode";

async function setup() {
	// Fetch all users without a referral code
	const usersWithoutCodes = await User.find({ referralCode: { $exists: false } });
	// Iterate over each user
	for (const user of usersWithoutCodes) {
		const referralCode = generateReferralCode(user.firstName, user.lastName);

		// Update the user's record with the new referral code
		await User.updateOne({ _id: user._id }, { referralCode });
	}
}

async function setupReferrals() {
	await mongoose
		.connect(process.env.USERS_SERVICE_DB_URL!)
		.then(async () => {
			console.log("Connected to db");
			await setup();
			console.log("Referral codes have been successfully added to all users.");
		})
		.catch((err) => {
			console.error(`Failed to connect to db. Error: ${err.message}`);
		});

	await mongoose.disconnect();
}

setupReferrals();
