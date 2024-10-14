import * as crypto from "crypto";
import User from "../models/User";

interface INameInput {
	firstName: string;
	lastName: string;
}

interface IConvert {
	num: number;
	base: number;
}

// Function to convert a number to a base-n string
function baseConvert({ num, base }: IConvert): string {
	const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	let converted = "";

	while (num > 0) {
		converted = chars[num % base] + converted;
		num = Math.floor(num / base);
	}

	return converted || "0";
}

// Function to generate the referral code
function generateReferralCode({ firstName, lastName }: INameInput): string {
	// Get initials
	const initials = (firstName[0] + lastName[0]).toUpperCase();

	// Create a unique string using initials and user ID
	const uniqueString = `${initials}${crypto.randomUUID().toString().replace(/-/g, "")}`;

	// Use SHA1 to hash the unique string
	const hash = crypto.createHash("sha1").update(uniqueString).digest("hex");

	// Convert a portion of the hash to a number and then to base-36
	const hashSegment = hash.substring(0, 6); // Use first 6 characters of hash
	const decimalValue = parseInt(hashSegment, 16);
	const base36Value = baseConvert({ num: decimalValue, base: 36 });

	// Combine initials and base36 hash to form referral code
	const referralCode = initials + base36Value.substring(0, Math.min(6, 8 - initials.length));

	return referralCode;
}

// Generate a unique referral code with a retry mechanism
async function createUniqueReferralCode({ firstName, lastName }: INameInput): Promise<string> {
	let isUnique = false;
	let referralCode = "";

	while (!isUnique) {
		referralCode = generateReferralCode({ firstName, lastName });
		const existingUser = await User.findOne({ referralCode });

		if (!existingUser) {
			isUnique = true;
		}
	}

	return referralCode;
}

export { generateReferralCode, createUniqueReferralCode };
