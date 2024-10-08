import { Request, Response, NextFunction } from "express";
import { EXCLUDE_FIELDS, PAGINATION, ResponseMessage } from "../../config/constants";
import { apiResponseHandler } from "@traderapp/shared-resources";
import UserRelationship from "../../models/UserRelationship";

export async function getUserReferrals(req: Request, res: Response, next: NextFunction) {
	try {
		const { page, size } = req.query;
		const options = {
			page: page ?? PAGINATION.PAGE,
			limit: size ?? PAGINATION.LIMIT,
			// select: EXCLUDE_FIELDS.USER,
		};
		const referrals = await UserRelationship.find({ parentId: req.query.id }).populate(
			"userId",
			EXCLUDE_FIELDS.USER,
		);
		res.status(200).json(
			apiResponseHandler({
				object: { ...referrals },
				message: ResponseMessage.GET_REFERRALS,
			}),
		);
	} catch (err) {
		next(err);
	}
}
