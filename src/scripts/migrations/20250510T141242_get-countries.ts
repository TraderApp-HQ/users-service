import { getCountries } from "../../fixtures";
import Country from "../../models/Country";

export async function up() {
	console.log("Running migration: 20250510T141242_get-countries.ts");
	// Your migration logic here
	await getCountries();

	console.log("Migration completed successfully for: 20250510T141242_get-countries.ts");
}

export async function down() {
	console.log("Rolling back migration: 20250510T141242_get-countries.ts");
	// Your rollback logic here

	await Country.deleteMany({}); // Deletes all countries records

	console.log("Rollback completed successfully for: 20250510T141242_get-countries.ts");
}
