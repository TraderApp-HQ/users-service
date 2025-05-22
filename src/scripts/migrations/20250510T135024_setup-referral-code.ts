import User from "../../models/User";
import { ReferralService } from "../../services/ReferralService";

export async function up() {
	console.log("Running migration: 20250510T135024_setup-referral-code.ts");
	// Your migration logic here

	const usersWithoutCodes = await User.find({ referralCode: { $exists: false } });
	const referralService = new ReferralService();

	const bulkOperations = usersWithoutCodes.map((user) => {
		const referralCode = referralService.generateReferralCode({
			firstName: user.firstName,
			lastName: user.lastName,
		});

		return {
			updateOne: {
				filter: { _id: user._id },
				update: { referralCode },
			},
		};
	});

	if (bulkOperations.length > 0) {
		await User.bulkWrite(bulkOperations);
	}

	console.log("Migration completed successfully for: 20250510T135024_setup-referral-code.ts");
}

export async function down() {
	console.log("Rolling back migration: 20250510T135024_setup-referral-code.ts");
	// Your rollback logic here
	await User.updateMany(
		{ referralCode: { $exists: true } }, // only users who have a referral code
		{ $unset: { referralCode: "" } }, // removes the field
	);

	console.log("Rollback completed successfully for: 20250510T135024_setup-referral-code.ts");
}
