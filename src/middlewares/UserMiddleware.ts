import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { checkUser } from "../utils/token-functions";

export async function validateUpdateUser(req: Request, res: Response, next: NextFunction) {
	try {
		await checkUser(req);
		// define validation schemda
		const schema = Joi.object({
			id: Joi.string().label("User id"),
			first_name: Joi.string().label("First Name"),
			last_name: Joi.string().label("Last Name"),
			phone: Joi.string().label("Phone"),
			dob: Joi.string().label("Date of Birth"),
		});
		// validate request
		const { error } = schema.validate(req.body);

		if (error) {
			// strip string of double quotes
			error.message = error.message.replace(/\"/g, "");
			next(error);
			return;
		}

		next();
	} catch (err: any) {
		next(err);
	}
}

export async function validateGetAllUsers(req: Request, res: Response, next: NextFunction) {
	try {
		await checkUser(req);
		const schema = Joi.object({
			page: Joi.string().label("Page"),
			size: Joi.string().label("Size"),
			searchKeyword: Joi.string().label("searchKeyword").allow(""),
		});
		// validate request
		const { error } = schema.validate(req.query); // change to query

		if (error) {
			// strip string of double quotes
			error.message = error.message.replace(/\"/g, "");
			next(error);
			return;
		}
		next();
	} catch (err: any) {
		next(err);
	}
}

export async function validateGetUser(req: Request, res: Response, next: NextFunction) {
	try {
		await checkUser(req);
		const schema = Joi.object({
			id: Joi.string().label("id"),
		});
		// validate request
		const { error } = schema.validate(req.params);

		if (error) {
			// strip string of double quotes
			error.message = error.message.replace(/\"/g, "");
			next(error);
			return;
		}
		next();
	} catch (err: any) {
		next(err);
	}
}
