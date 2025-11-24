import User from "../../models/User";

export async function up() {
	console.log("Running migration: 20250708T143057_add-personal-atc-funded-field.ts");
	// Your migration logic here

	await User.updateMany(
		{},
		{
			isPersonalATCFunded: false,
		},
	);
	console.log(
		"Migration completed successfully for: 20250708T143057_add-personal-atc-funded-field.ts",
	);
}

export async function down() {
	console.log("Rolling back migration: 20250708T143057_add-personal-atc-funded-field.ts");
	// Your rollback logic here

	console.log(
		"Rollback completed successfully for: 20250708T143057_add-personal-atc-funded-field.ts",
	);
}
