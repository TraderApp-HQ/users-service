import * as crypto from "crypto";
import { EXCLUDE_FIELDS, ReferralRank } from "../../config/constants";
import { generateInviteUrl } from "../../helpers/tokens";
import User, { IUserModel } from "../../models/User";
import UserRelationship from "../../models/UserRelationship";
import { publishMessageToQueue } from "../../utils/helpers/SQSClient/helpers";
import { IQueueMessage, IQueueMessageBodyObject } from "../../utils/helpers/types";
import { Types } from "mongoose";
import { Status } from "../../config/enums";

type PaginationType = string | string[] | undefined | number;

interface INameInput {
	firstName: string;
	lastName: string;
}

interface IConvert {
	num: number;
	base: number;
}

interface IReferralQueryParams {
	page: PaginationType;
	limit: PaginationType;
	userId: string;
	minLevel?: number;
	maxLevel?: number;
}

interface IFetchRelationshipsInput {
	query: object;
	populateField: string;
	page: PaginationType;
	limit: PaginationType;
}

class ReferralService {
	private async fetchRelationships({
		query,
		populateField,
		page,
		limit,
	}: IFetchRelationshipsInput) {
		let queryBuilder = UserRelationship.find(query)
			.populate(populateField, EXCLUDE_FIELDS.USER)
			.sort({ level: "asc" });

		const isPaginated = limit && Number(limit) > 0;

		if (isPaginated) {
			queryBuilder = queryBuilder
				.limit(Number(limit))
				.skip(Number(limit) * (Number(page) - 1));
		}

		const results = await queryBuilder.exec();

		const totalDocs = isPaginated
			? await UserRelationship.countDocuments(query)
			: results.length;

		return {
			results,
			totalDocs,
			totalPages: Math.ceil(totalDocs / Number(limit)),
		};
	}

	async getUserReferralIds(userId: string) {
		const relationships = await UserRelationship.find(
			{ parentId: userId },
			{ userId: 1, _id: 0 },
		).lean();
		const referralIds = relationships.map((rel) => rel.userId.toString());
		return { userId, referralIds };
	}

	async getUserReferrals({
		page,
		limit,
		userId,
		minLevel = 1,
		maxLevel = 15,
	}: IReferralQueryParams) {
		const {
			results: referrals,
			totalDocs,
			totalPages,
		} = await this.fetchRelationships({
			query: { parentId: userId, level: { $gte: minLevel, $lte: maxLevel } },
			populateField: "userId",
			page,
			limit,
		});
		return {
			referrals,
			totalDocs,
			totalPages,
		};
	}

	async getUserReferrers({ page, limit, userId, minLevel, maxLevel }: IReferralQueryParams) {
		const {
			results: referrers,
			totalDocs,
			totalPages,
		} = await this.fetchRelationships({
			query: { userId, level: { $gte: minLevel, $lte: maxLevel } },
			populateField: "parentId",
			page,
			limit,
		});
		return {
			referrers,
			totalDocs,
			totalPages,
		};
	}

	private async _getUserReferralStats(userData: IUserModel & { _id: Types.ObjectId }) {
		return {
			referralCode: userData.referralCode,
			referralLink: generateInviteUrl(userData.referralCode),
			currentRank: ReferralRank.TA_RECRUIT,
			currentEarning: 0,
			rankProgress: 0,
		};
	}

	async getUserReferralStats(userId: string) {
		const userData = await User.findById(userId);
		if (!userData) throw new Error("Server error");

		return this._getUserReferralStats(userData);
	}

	private async _getCommunityStats(userData: IUserModel & { _id: Types.ObjectId }) {
		const count = await UserRelationship.count({ parentId: userData.id });
		const [top] = await UserRelationship.find({ parentId: userData.id })
			.sort({ level: "descending" })
			.limit(1);

		return {
			communityMembers: count,
			communityATC: 0,
			referralTreeLevels: top?.level ?? 0,
		};
	}

	async sendUserReferralIdsToQueue() {
		const queueUrl = process.env.REFERRALS_DATA_QUEUE ?? "";
		const BATCH_SIZE = 500;
		let skip = 0;
		let hasMore = true;
		const promiseList: Array<Promise<void>> = [];

		while (hasMore) {
			const users = await User.find({ status: Status.ACTIVE })
				.select("id")
				.limit(BATCH_SIZE)
				.skip(skip)
				.lean();
			if (users.length === 0) {
				hasMore = false;
			}
			const promises = users.map(async (user) => {
				const { userId, referralIds } = await this.getUserReferralIds(user.id);
				const message = { userId, referralIds, event: "GET_TRADING_BALANCE" };

				await publishMessageToQueue({ queueUrl, message });
			});

			promiseList.push(...promises);
			skip += BATCH_SIZE;
		}

		await Promise.all(promiseList);
	}

	async getCommunityStats(userId: string) {
		const userData = await User.findById(userId);
		if (!userData) throw new Error("Server error");

		return this._getCommunityStats(userData);
	}

	async getReferralOverview(userId: string) {
		const userData = await User.findById(userId);
		if (!userData) throw new Error("Server error");

		const [userReferralStats, communityStats] = await Promise.all([
			this._getUserReferralStats(userData),
			this._getCommunityStats(userData),
		]);

		return {
			...userReferralStats,
			...communityStats,
		};
	}

	async inviteFriends(emails: string[], userId: string) {
		const emailSubject = "Join TraderApp Early & Get 90% Off—Unlock Consistent Profits Today";
		const userData = await User.findById(userId);

		if (!userData) throw new Error("Server error");

		const url = generateInviteUrl(userData.referralCode);

		const recipients = emails.map((email) => ({
			firstName: "",
			emailAddress: email,
		}));

		const message: IQueueMessageBodyObject = {
			recipients,
			message: url,
			event: "INVITE_USER",
			sender: {
				firstName: userData.firstName,
				lastName: userData.lastName,
			},
			subject: emailSubject,
		};

		await publishMessageToQueue({
			queueUrl: process.env.EMAIL_NOTIFICATIONS_QUEUE ?? "",
			message,
		});
	}

	// Function to convert a number to a base-n string
	baseConvert({ num, base }: IConvert): string {
		const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		let converted = "";

		while (num > 0) {
			converted = chars[num % base] + converted;
			num = Math.floor(num / base);
		}

		return converted || "0";
	}

	// Function to generate the referral code
	generateReferralCode({ firstName, lastName }: INameInput): string {
		// Get initials
		const initials = (firstName[0] + lastName[0]).toUpperCase();

		// Create a unique string using initials and user ID
		const uniqueString = `${initials}${crypto.randomUUID().toString().replace(/-/g, "")}`;

		// Use SHA1 to hash the unique string
		const hash = crypto.createHash("sha1").update(uniqueString).digest("hex");

		// Convert a portion of the hash to a number and then to base-36
		const hashSegment = hash.substring(0, 6); // Use first 6 characters of hash
		const decimalValue = parseInt(hashSegment, 16);
		const base36Value = this.baseConvert({ num: decimalValue, base: 36 });

		// Combine initials and base36 hash to form referral code
		const referralCode = initials + base36Value.substring(0, Math.min(6, 8 - initials.length));

		return referralCode;
	}

	// Generate a unique referral code with a retry mechanism
	async createUniqueReferralCode({ firstName, lastName }: INameInput): Promise<string> {
		let isUnique = false;
		let referralCode = "";

		while (!isUnique) {
			referralCode = this.generateReferralCode({ firstName, lastName });
			const existingUser = await User.findOne({ referralCode });

			if (!existingUser) {
				isUnique = true;
			}
		}

		return referralCode;
	}
}

export { ReferralService };
