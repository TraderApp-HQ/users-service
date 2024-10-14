import UserRelationship from "../models/UserRelationship";

interface IStoreRelationshipsInput {
	user: string;
	parent: string | null;
}

// Function to generate the referral relationships
async function storeRelationships({ user, parent }: IStoreRelationshipsInput) {
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

	const relationships = [];

	// Traverse up the parent chain to store relationships
	while (parent) {
		const parentRelationship: any = await UserRelationship.findOne({ user: parent });

		if (parentRelationship) {
			currentLevel++;
			relationships.push({
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

	if (relationships.length) {
		await UserRelationship.insertMany(relationships);
	}
}

export { storeRelationships };
