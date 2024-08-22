import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { Role } from "../config/enums";
import { checkAdmin, checkUser } from "../helpers/middlewares";

export async function validateUpdateUser(req: Request, res: Response, next: NextFunction) {
	try {
		await checkUser(req);
		// define validation schemda
		const roleSchema = Joi.string().valid(...Object.values(Role));

		const schema = Joi.object({
			id: Joi.string().label("User id"),
			firstName: Joi.string().label("First Name"),
			lastName: Joi.string().label("Last Name"),
			phone: Joi.string().label("Phone"),
			dob: Joi.string().label("Date of Birth"),
			role: Joi.array().items(roleSchema).min(1),
			countryId: Joi.number().label("Country Id"),
			countryName: Joi.string().label("Country Name"),
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
		await checkAdmin(req);
		const schema = Joi.object({
			page: Joi.string().label("Page"),
			size: Joi.string().label("Size"),
			searchKeyword: Joi.string().label("searchKeyword").allow(""),
		});
		// validate request
		const { error } = schema.validate(req.query);
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
		let userId;
		const { id } = req.query;
		if (id) {
			await checkAdmin(req);
			userId = id;
		} else {
			const { id } = await checkUser(req);
			userId = id;
		}
		req.query.id = userId;
		next();
	} catch (err: any) {
		next(err);
	}
}
