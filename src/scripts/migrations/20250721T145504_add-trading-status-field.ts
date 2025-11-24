import { Status, TradingStatus } from "../../config/enums";
import User from "../../models/User";

export async function up() {
	console.log("Running migration: 20250721T145504_add-trading-status-field.ts");
	// Your migration logic here

	// Reverse user status back to "active" and include tradingStatus with "inactive"
	await User.updateMany(
		{},
		{
			status: Status.ACTIVE,
			tradingStatus: TradingStatus.INACTIVE,
		},
	);

	console.log(
		"Migration completed successfully for: 20250721T145504_add-trading-status-field.ts",
	);
}

export async function down() {
	console.log("Rolling back migration: 20250721T145504_add-trading-status-field.ts");
	// Your rollback logic here

	await User.updateMany(
		{},
		{
			status: Status.INACTIVE,
		},
	);

	console.log("Rollback completed successfully for: 20250721T145504_add-trading-status-field.ts");
}
