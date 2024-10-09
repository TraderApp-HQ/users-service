import { Request, Response, NextFunction } from "express";
import { EXCLUDE_FIELDS, PAGINATION, ResponseMessage } from "../../config/constants";
import { apiResponseHandler, logger } from "@traderapp/shared-resources";
import UserRelationship from "../../models/UserRelationship";
import User from "../../models/User";
import { IQueueMessage } from "../../utils/helpers/types";
import { publishMessageToQueue } from "../../utils/helpers/SQSClient/helpers";
import { generateInviteUrl } from "../../helpers/tokens";

export async function getUserReferrals(req: Request, res: Response, next: NextFunction) {
	try {
		const { page, size } = req.query;
		const options = {
			page: page ?? PAGINATION.PAGE,
			limit: size ?? PAGINATION.LIMIT,
		};

		const referrals = await UserRelationship.find(
			{ parent: req.query.id },
			// options,
		).populate("userId", EXCLUDE_FIELDS.USER);
		res.status(200).json(
			apiResponseHandler({
				object: { referrals },
				message: ResponseMessage.GET_REFERRALS,
			}),
		);
	} catch (err) {
		next(err);
	}
}

export async function getUserReferralsStats(req: Request, res: Response, next: NextFunction) {
	try {
		const userData = await User.findById(req.query.id);

		if (!userData) throw new Error("Server error");

		res.status(200).json(
			apiResponseHandler({
				object: {
					referralCode: userData.referralCode,
					referralLink: generateInviteUrl(userData.referralCode),
					currentRank: "TA-Recruit",
					currentEarning: 0,
					rankProgress: 0,
				},
				message: ResponseMessage.GET_REFERRALS_SUMMARY,
			}),
		);
	} catch (err) {
		next(err);
	}
}

export async function getCommunityStats(req: Request, res: Response, next: NextFunction) {
	try {
		const userData = await User.findById(req.query.id);

		if (!userData) throw new Error("Server error");

		const count = await UserRelationship.count({ parent: userData.id });
		const [top] = await UserRelationship.find({ parent: userData.id })
			.sort({ level: "descending" })
			.limit(1);

		res.status(200).json(
			apiResponseHandler({
				object: {
					communityMembers: count,
					communityATC: 0,
					referralTreeLevels: top?.level ?? 0,
				},
				message: ResponseMessage.GET_REFERRALS_SUMMARY,
			}),
		);
	} catch (err) {
		next(err);
	}
}

export async function inviteFriends(req: Request, res: Response, next: NextFunction) {
	try {
		const { emails }: { emails: string[] } = req.body;

		const userData = await User.findById(req.query.id);

		if (!userData) throw new Error("Server error");

		const url = generateInviteUrl(userData.referralCode);

		for (const email of emails) {
			const message: IQueueMessage = {
				channel: ["EMAIL"],
				messageObject: {
					recipientName: userData.firstName,
					messageBody: url,
					emailAddress: email,
				},
				event: "INVITE_USER",
			};
			await publishMessageToQueue({
				queueUrl: process.env.NOTIFICATIONS_SERVICE_QUEUE_URL ?? "",
				message,
			});
		}

		logger.log(`User Invites sent to queue`);

		res.status(200).json(
			apiResponseHandler({
				message: "Invite(s) sent!",
			}),
		);
	} catch (err) {
		next(err);
	}
}
