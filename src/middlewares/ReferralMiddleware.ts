import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { checkUser } from "../helpers/middlewares";

export async function validateGetReferral(req: Request, res: Response, next: NextFunction) {
	try {
		const { id } = req.query;
		if (!id) {
			const { id } = await checkUser(req);
			req.query.id = id;
		}
		next();
	} catch (err: any) {
		next(err);
	}
}

export async function validateInviteFriends(req: Request, res: Response, next: NextFunction) {
	try {
		const { id } = await checkUser(req);
		req.query.id = id;

		// define validation schema
		const schema = Joi.object({
			emails: Joi.array().items(Joi.string().email()).required().label("Emails"),
		});

		// Remove invalid emails
		req.body.emails = req.body.emails.filter((email: string) => {
			const { error } = schema.validate({ emails: [email] });
			return !error;
		});

		next();
	} catch (err: any) {
		next(err);
	}
}
