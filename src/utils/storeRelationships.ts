import UserRelationship from "../models/UserRelationship";

// Function to generate the referral relationships
export async function storeRelationships(userId: string, parentId: string | null) {
	const createdAt = new Date();

	if (!parentId) return;

	let currentLevel = 1;

	// Insert direct parent relationship
	await UserRelationship.create({
		userId,
		parentId,
		level: currentLevel,
		createdAt,
	});

	// Traverse up the parent chain to store relationships
	while (parentId) {
		const parentRelationship: any = await UserRelationship.findOne({ userId: parentId });

		if (parentRelationship) {
			currentLevel++;
			await UserRelationship.create({
				userId,
				parentId: parentRelationship.parentId,
				level: currentLevel,
				createdAt,
			});
			parentId = parentRelationship.parentId;
		} else {
			break;
		}
	}
}
