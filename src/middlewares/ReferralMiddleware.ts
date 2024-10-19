import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { checkUser } from "../helpers/middlewares";

export async function validateGetReferral(req: Request, res: Response, next: NextFunction) {
	try {
		const { id } = req.query
		if (!id) {
  			const { id } = await checkUser(req)
  			req.query.id = id
		}
		next()
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

		// validate request
		const { error } = schema.validate({ emails: req.body.emails });

		if (error) {
			// strip string of double quotes
			error.message = error.message.replace(/\"/g, "");
			next(error);
		}

		next();
	} catch (err: any) {
		next(err);
	}
}
