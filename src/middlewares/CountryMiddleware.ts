import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export async function validateGetCountryRequest(req: Request, res: Response, next: NextFunction) {
	const { id } = req.params;

	const schema = Joi.object({
		id: Joi.number().required().label("country_id"),
	});

	const { error } = schema.validate({ id });

	if (error) {
		// strip string of double quotes
		error.message = error.message.replace(/\"/g, "");
		next(error);
	} else {
		next();
	}
}
