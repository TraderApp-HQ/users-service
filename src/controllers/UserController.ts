import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import { apiResponseHandler } from "@traderapp/shared-resources";
import { ResponseMessage, PAGINATION, EXCLUDE_FIELDS } from "../config/constants";

export async function getAllUsers(req: Request, res: Response, next: NextFunction) {
	try {
		const { page, size, searchKeyword } = req.query;
		const options = {
			page: page ?? PAGINATION.PAGE,
			limit: size ?? PAGINATION.LIMIT,
			select: EXCLUDE_FIELDS.USER,
		};
		const searchQuery = searchKeyword ?? "";
		const queryParams = {
			$or: [
				{ first_name: { $regex: searchQuery, $options: "i" } },
				{ last_name: { $regex: searchQuery, $options: "i" } },
				{ email: { $regex: searchQuery, $options: "i" } },
			],
		};
		const users = await User.paginate(queryParams, options);
		res.status(200).json(
			apiResponseHandler({
				object: users,
				message: ResponseMessage.GET_USERS,
			}),
		);
	} catch (err) {
		next(err);
	}
}

export async function getUserById(req: Request, res: Response, next: NextFunction) {
	try {
		const { id } = req.params;
		const user = await User.findById(id).select(EXCLUDE_FIELDS.USER);
		res.status(200).json(
			apiResponseHandler({
				object: user,
				message: ResponseMessage.GET_USER,
			}),
		);
	} catch (err) {
		next(err);
	}
}

export async function updateUserById(req: Request, res: Response, next: NextFunction) {
	try {
		const { id } = req.body;
		const user = await User.findByIdAndUpdate(id, req.body, { new: true }).select(
			EXCLUDE_FIELDS.USER,
		);
		res.status(200).json(
			apiResponseHandler({
				object: user,
				message: ResponseMessage.UPDATE_USER,
			}),
		);
	} catch (err) {
		next(err);
	}
}
