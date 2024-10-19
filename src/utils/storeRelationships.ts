import UserRelationship from "../models/UserRelationship";

interface IStoreRelationshipsInput {
	userId: string;
	parentId?: string;
}

// Function to generate the referral relationships
async function storeRelationships({ userId, parentId }: IStoreRelationshipsInput) {
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

	const relationships = [];

	// Traverse up the parent chain to store relationships
	while (parentId) {
		const parentRelationship: any = await UserRelationship.findOne({ user: parentId });

		if (parentRelationship) {
			currentLevel++;
			relationships.push({
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

	if (relationships.length) {
		await UserRelationship.insertMany(relationships);
	}
}

export { storeRelationships };
