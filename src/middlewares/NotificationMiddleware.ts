import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { Role } from "../config/enums";
import { checkAdmin, checkUser } from "../helpers/middlewares";
import { RESPONSE_FLAGS } from "../config/constants";

export async function validateSubscribeToPushNotifications(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const { endpoint, keys } = req.body;

	if (!endpoint || !keys?.p256dh || !keys?.auth) {
		const error = new Error("Invalid subscription data");
		error.name = RESPONSE_FLAGS.validationError;
		throw error;
	}

	const { id } = await checkUser(req);
	req.body.userId = id;
	next();
}

export async function validateUnsubscribeFromPushNotifications(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const { id } = await checkUser(req);
	req.body.userId = id;
	next();
}
