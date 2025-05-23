import * as crypto from "crypto";
import "dotenv/config";
import { EXCLUDE_FIELDS, RANK_REQUIREMENTS } from "../../config/constants";
import { generateInviteUrl } from "../../helpers/tokens";
import User, { IUserModel } from "../../models/User";
import UserRelationship from "../../models/UserRelationship";
import { publishMessageToQueue } from "../../utils/helpers/SQSClient/helpers";
import { IQueueMessage, IQueueMessageBodyObject } from "../../utils/helpers/types";
import { Types } from "mongoose";
import { Status } from "../../config/enums";
import {
	IRankCriteria,
	IRankData,
	IUserData,
	ReferralRankType,
	IReferralData,
} from "../../config/interfaces";
import { logger } from "@traderapp/shared-resources";
import { FeatureFlagManager } from "../../utils/helpers/SplitIOClient";

const REFERRAL_USER_FIELDS = "id firstName lastName email referralRank -_id";

const VALID_SORT_FIELDS = ["level", "createdAt"] as const;
type SortFieldType = (typeof VALID_SORT_FIELDS)[number];

const VALID_SORT_ORDERS = ["asc", "desc"] as const;
type SortOrderType = (typeof VALID_SORT_ORDERS)[number];

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
	sortField?: SortFieldType;
	sortOrder?: SortOrderType;
}

class ReferralService {
	private readonly MIN_LEVEL = 1;
	private readonly MAX_LEVEL = 15;

	private async fetchRelationships({
		query,
		populateField,
		page,
		limit,
		sortField = "createdAt",
		sortOrder = "desc",
	}: IFetchRelationshipsInput) {
		if (!VALID_SORT_FIELDS.includes(sortField)) {
			sortField = "createdAt";
		}

		if (!VALID_SORT_ORDERS.includes(sortOrder)) {
			sortOrder = "desc";
		}

		const paginateOptions = {
			page: Number(page),
			limit: Number(limit),
			sort: { [sortField]: sortOrder },
			populate: {
				path: populateField,
				select: EXCLUDE_FIELDS.USER,
			},
		};

		return UserRelationship.paginate(query, paginateOptions);
	}

	private computeRankData(criteria: IRankCriteria): IRankData {
		const { personalATC, communityATC, communitySize, isTestReferralTracking } = criteria;

		const rankData: IRankData = Object.fromEntries(
			Object.keys(RANK_REQUIREMENTS).map((rank) => [
				rank,
				{
					personalATC: { completed: false, minValue: 0 },
					communityATC: { completed: false, minValue: 0 },
					communitySize: { completed: false, minValue: 0 },
				},
			]),
		) as IRankData;

		for (const rank of Object.keys(RANK_REQUIREMENTS) as ReferralRankType[]) {
			rankData[rank] = {
				personalATC: {
					completed: personalATC >= RANK_REQUIREMENTS[rank].personalATC,
					minValue: RANK_REQUIREMENTS[rank].personalATC,
				},
				communityATC: {
					completed: communityATC >= RANK_REQUIREMENTS[rank].communityATC,
					minValue: RANK_REQUIREMENTS[rank].communityATC,
				},
				communitySize: {
					completed:
						communitySize >=
						(isTestReferralTracking
							? RANK_REQUIREMENTS[rank].testCommunitySize
							: RANK_REQUIREMENTS[rank].communitySize),
					minValue: isTestReferralTracking
						? RANK_REQUIREMENTS[rank].testCommunitySize
						: RANK_REQUIREMENTS[rank].communitySize,
				},
			};
		}

		return rankData;
	}

	async getUserReferralProfiles(userProfile: IUserModel): Promise<IReferralData> {
		const referrals = await UserRelationship.find<{ userId: IUserData }>(
			{ parentId: userProfile.id },
			{ userId: 1, _id: 0 },
		)
			.populate({ path: "userId", select: REFERRAL_USER_FIELDS })
			.lean();
		const { id, firstName, lastName, email, referralRank } = userProfile;
		const user: IUserData = { id, firstName, lastName, email, referralRank };
		return { user, referrals: referrals.map((ref) => ref.userId) };
	}

	// Client-facing API for paginated referral data access
	async getUserReferrals({
		page,
		limit,
		userId,
		minLevel = this.MIN_LEVEL,
		maxLevel = this.MAX_LEVEL,
	}: IReferralQueryParams) {
		return this.fetchRelationships({
			query: { parentId: userId, level: { $gte: minLevel, $lte: maxLevel } },
			populateField: "userId",
			page,
			limit,
		});
	}

	async getUserReferrers({ page, limit, userId, minLevel, maxLevel }: IReferralQueryParams) {
		return this.fetchRelationships({
			query: { userId, level: { $gte: minLevel, $lte: maxLevel } },
			populateField: "parentId",
			page,
			limit,
		});
	}

	private async _getUserReferralStats(userData: IUserModel) {
		return {
			referralCode: userData.referralCode,
			referralLink: generateInviteUrl(userData.referralCode),
			currentRank: userData.referralRank,
			personalATC: userData.personalATC,
			currentEarning: 0,
			rankProgress: 0,
		};
	}

	async getUserReferralStats(userId: string) {
		const userData = await User.findById(userId);
		if (!userData) throw new Error("Server error");

		return this._getUserReferralStats(userData);
	}

	private async _getCommunityStats(userData: IUserModel) {
		const count = await UserRelationship.count({ parentId: userData.id });
		const [top] = await UserRelationship.find({ parentId: userData.id })
			.sort({ level: "descending" })
			.limit(1);

		return {
			communitySize: count,
			communityATC: userData.communityATC,
			referralTreeLevels: top?.level ?? 0,
		};
	}

	async sendUserReferralProfileToQueue(userId: string) {
		const userData = await User.findById(userId);
		if (!userData) throw new Error("Server error");

		const queueUrl = process.env.USER_REFERRALS_TRACKING_QUEUE ?? "";

		const referralProfiles = await this.getUserReferralProfiles(userData);

		const featureFlags = new FeatureFlagManager();
		const isReferralTracking = await featureFlags.checkToggleFlag(
			"release-referral-tracking",
			userId,
		);

		if (isReferralTracking) {
			referralProfiles.isTestReferralTracking = true;
		}

		await User.findByIdAndUpdate(userId, { isTestReferralTrackingInProgress: true });

		await publishMessageToQueue({ queueUrl, message: referralProfiles });
		logger.log(`User (${userId}) referrals published to queue`);
	}

	async sendUserReferralProfilesToQueue() {
		const queueUrl = process.env.USER_REFERRALS_TRACKING_QUEUE ?? "";
		const BATCH_SIZE = 5000;
		const referralProfilePromises: Array<
			Promise<{
				user: IUserData;
				referrals: IUserData[];
			}>
		> = [];

		const cursor = User.find({ status: Status.ACTIVE })
			.select(REFERRAL_USER_FIELDS)
			.lean()
			.cursor();
		let batch: IUserModel[] = [];

		for await (const userProfile of cursor) {
			batch.push(userProfile);

			if (batch.length === BATCH_SIZE) {
				referralProfilePromises.push(
					...batch.map(async (user) => this.getUserReferralProfiles(user)),
				);
				batch = [];
			}
		}

		// Process the last batch if any users are left
		if (batch.length > 0) {
			referralProfilePromises.push(
				...batch.map(async (user) => this.getUserReferralProfiles(user)),
			);
		}

		const referralProfiles = await Promise.all(referralProfilePromises);

		const queuePromises = referralProfiles.map(async (profile) =>
			publishMessageToQueue({ queueUrl, message: profile }),
		);

		await Promise.all(queuePromises);
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

		const featureFlags = new FeatureFlagManager();
		const isReferralTracking = await featureFlags.checkToggleFlag(
			"release-referral-tracking",
			userId,
		);

		const criteria: IRankCriteria = {
			personalATC: userReferralStats.personalATC ?? 0,
			communityATC: communityStats.communityATC ?? 0,
			communitySize: communityStats.communitySize ?? 0,
			isTestReferralTracking: isReferralTracking,
		};

		const rankData = this.computeRankData(criteria);

		return {
			...userReferralStats,
			...communityStats,
			rankData,
			isTestReferralTrackingInProgress: userData.isTestReferralTrackingInProgress,
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
