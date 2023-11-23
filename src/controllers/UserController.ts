import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import apiResponse from "../utils/response-handler";
import { ResponseMessage } from "../config/constants";
import { validateGetAllUser, validateUpdateUser } from "../middlewares/UserMiddleware";
import { restrictAccess } from "../utils/token-functions";

export async function getAllUsers(req: Request, res: Response, next: NextFunction) {
	try {
		await validateGetAllUser(req.body, next);

		const { id } = req.body;
		const accessToken = (req.headers.authorization as string)?.split(" ")[1] ?? "";
		restrictAccess({ token: accessToken, userId: id ?? "" }, next);
		// add access authentication
		const { page, size } = req.body;
		const options = {
			page: page || 1,
			limit: size || 10,
		};
		const users = await User.paginate({}, options);
		res.status(200).json(
			apiResponse({
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
		// add access authentication
		const { id } = req.params;

		const accessToken = (req.headers.authorization as string)?.split(" ")[1] ?? "";
		restrictAccess({ token: accessToken, userId: id ?? "" }, next);

		const user = await User.findById(id);
		res.status(200).json(
			apiResponse({
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
		// update validation
		await validateUpdateUser(req.body, next);
		// restrict access
		const { id } = req.body;
		const accessToken = (req.headers.authorization as string)?.split(" ")[1] ?? "";
		restrictAccess({ token: accessToken, userId: id ?? "" }, next);

		const user = await User.findByIdAndUpdate(id, req.body, { new: true });
		res.status(200).json(
			apiResponse({
				object: user,
				message: ResponseMessage.UPDATE_USER,
			}),
		);
	} catch (err) {
		next(err);
	}
}
