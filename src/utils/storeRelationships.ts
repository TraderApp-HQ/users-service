import UserRelationship from "../models/UserRelationship";

// Function to generate the referral relationships
export async function storeRelationships(user: string, parent: string | null) {
	const createdAt = new Date();

	if (!parent) return;

	let currentLevel = 1;

	// Insert direct parent relationship
	await UserRelationship.create({
		user,
		parent,
		level: currentLevel,
		createdAt,
	});

	// Traverse up the parent chain to store relationships
	while (parent) {
		const parentRelationship: any = await UserRelationship.findOne({ user: parent });

		if (parentRelationship) {
			currentLevel++;
			await UserRelationship.create({
				user,
				parent: parentRelationship.parent,
				level: currentLevel,
				createdAt,
			});
			parent = parentRelationship.parent;
		} else {
			break;
		}
	}
}
