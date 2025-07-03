import User from "../../models/User";

export async function up() {
	console.log("Running migration: 20250621T115120_update-user-records.ts");
	// Your migration logic here

	await User.updateMany(
		{},
		{
			isFirstDepositMade: false,
			isTradingAccountConnected: false,
			isSocialAccountConnected: false,
			isOnboardingTaskDone: false,
			showOnboardingSteps: true,
			facebookUsername: "",
			twitterUsername: "",
			tiktokUsername: "",
			instagramUsername: "",
		},
	);

	console.log("Migration completed successfully for: 20250621T115120_update-user-records.ts");
}

export async function down() {
	console.log("Rolling back migration: 20250621T115120_update-user-records.ts");
	// Your rollback logic here

	console.log("Rollback completed successfully for: 20250621T115120_update-user-records.ts");
}
