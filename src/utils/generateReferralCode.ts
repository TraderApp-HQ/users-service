import * as crypto from "crypto";
import User from "../models/User";

// Function to convert a number to a base-n string
function baseConvert(number: number, base: number): string {
	const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	let converted = "";

	while (number > 0) {
		converted = chars[number % base] + converted;
		number = Math.floor(number / base);
	}

	return converted || "0";
}

// Function to generate the referral code
export function generateReferralCode(firstName: string, lastName: string, userId: number): string {
	// Get initials
	const initials = (firstName[0] + lastName[0]).toUpperCase();

	// Create a unique string using initials and user ID
	const uniqueString = `${initials}${userId}`;

	// Use SHA1 to hash the unique string
	const hash = crypto.createHash("sha1").update(uniqueString).digest("hex");

	// Convert a portion of the hash to a number and then to base-36
	const hashSegment = hash.substring(0, 6); // Use first 6 characters of hash
	const decimalValue = parseInt(hashSegment, 16);
	const base36Value = baseConvert(decimalValue, 36);

	// Combine initials and base36 hash to form referral code
	const referralCode =
		initials + "_" + base36Value.substring(0, Math.min(6, 8 - initials.length));

	return referralCode;
}

// Generate a unique referral code with a retry mechanism
export async function createUniqueReferralCode(
	firstName: string,
	lastName: string,
	userId: any,
): Promise<string> {
	let isUnique = false;
	let referralCode = "";

	while (!isUnique) {
		referralCode = generateReferralCode(firstName, lastName, userId);
		const existingUser = await User.findOne({ referralCode });

		if (!existingUser) {
			isUnique = true;
		}
	}

	return referralCode;
}
