import { Request, Response, NextFunction } from "express";
import User from "../../models/User";
import { apiResponseHandler } from "@traderapp/shared-resources";
import { ResponseMessage, PAGINATION, EXCLUDE_FIELDS } from "../../config/constants";
import { Status } from "../../config/enums";

export async function getAllUsers(req: Request, res: Response, next: NextFunction) {
	try {
		const { page, size, searchKeyword } = req.query;
		const options = {
			page: Number(page ?? PAGINATION.PAGE),
			limit: Number(size ?? PAGINATION.LIMIT),
			select: EXCLUDE_FIELDS.USER,
		};
		const searchQuery = searchKeyword ?? "";
		const queryParams = {
			$or: [
				{ firstName: { $regex: searchQuery, $options: "i" } },
				{ lastName: { $regex: searchQuery, $options: "i" } },
				{ email: { $regex: searchQuery, $options: "i" } },
			],
		};
		const users = await User.paginate(queryParams, options);
		res.status(200).json(
			apiResponseHandler({
				object: { ...users, searchKeyword },
				message: ResponseMessage.GET_USERS,
			}),
		);
	} catch (err) {
		next(err);
	}
}

export async function getUserById(req: Request, res: Response, next: NextFunction) {
	try {
		const { id } = req.query;
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

export async function toggleUserActivation(req: Request, res: Response, next: NextFunction) {
	try {
		const { id } = req.query;
		const user = await User.findById(id);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}
		const userStatus = user.status === Status.ACTIVE;
		await User.updateOne({ id }, { status: userStatus ? Status.INACTIVE : Status.ACTIVE });

		res.status(200).json(
			apiResponseHandler({
				object: user,
				message: userStatus
					? ResponseMessage.DEACTIVATE_USER
					: ResponseMessage.ACTIVATE_USER,
			}),
		);
	} catch (err) {
		next(err);
	}
}
