import { Request, Response, NextFunction } from "express";
import { PAGINATION, ResponseMessage } from "../../config/constants";
import { apiResponseHandler, logger } from "@traderapp/shared-resources";
import { ReferralService } from "../../services/ReferralService";

export async function getUserReferrals(req: Request, res: Response, next: NextFunction) {
	try {
		const { page, size } = req.query;
		const options = {
			page: (page as string) ?? PAGINATION.PAGE,
			limit: (size as string) ?? PAGINATION.LIMIT,
			userId: req.query.id as string,
		};
		const referralService = new ReferralService();
		const response = await referralService.getUserReferrals(options);
		res.status(200).json(
			apiResponseHandler({
				object: response,
				message: ResponseMessage.GET_REFERRALS,
			}),
		);
	} catch (err) {
		next(err);
	}
}

export async function getUserReferralsStats(req: Request, res: Response, next: NextFunction) {
	try {
		const referralService = new ReferralService();
		const referralStats = await referralService.getUserReferralStats(req.query.id as string);

		res.status(200).json(
			apiResponseHandler({
				object: referralStats,
				message: ResponseMessage.GET_REFERRALS_SUMMARY,
			}),
		);
	} catch (err) {
		next(err);
	}
}

export async function getCommunityStats(req: Request, res: Response, next: NextFunction) {
	try {
		const referralService = new ReferralService();
		const communityStats = await referralService.getCommunityStats(req.query.id as string);

		res.status(200).json(
			apiResponseHandler({
				object: communityStats,
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
		const referralService = new ReferralService();
		await referralService.inviteFriends(emails, req.query.id as string);

		logger.log(`User Invites sent to queue: ${JSON.stringify(emails)}`);

		res.status(200).json(
			apiResponseHandler({
				message: "Invite(s) sent!",
			}),
		);
	} catch (err) {
		next(err);
	}
}
