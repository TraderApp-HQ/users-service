import { TaskMode } from "../../config/enums";
import Task from "../../models/Task";

export async function up() {
	console.log("Running migration: 20250618T104234_update-tasks.ts");
	// Your migration logic here

	await Task.updateMany(
		{},
		{
			taskMode: TaskMode.GENERAL,
		},
	);

	console.log("Migration completed successfully for: 20250618T104234_update-tasks.ts");
}

export async function down() {
	console.log("Rolling back migration: 20250618T104234_update-tasks.ts");

	// Your rollback logic here
	await Task.updateMany(
		{},
		{
			taskMode: "",
		},
	);

	console.log("Rollback completed successfully for: 20250618T104234_update-tasks.ts");
}
