import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import bcrypt from "bcrypt";
import { verifyRefreshToken } from "../utils/token-functions";
import Token from "../models/RefreshToken";
import User from "../models/User";
import PasswordResetToken from "../models/PasswordResetToken";

export async function validateLoginRequest(req: Request, res: Response, next: NextFunction) {
	// get params from request body
	const { email, password } = req.body;

	// define validation schema
	const schema = Joi.object({
		email: Joi.string().email().required().label("Email"),
		password: Joi.string().required().label("Password"),
	});

	// validate request
	const { error } = schema.validate({ email, password });

	if (error) {
		// strip string of double quotes
		error.message = error.message.replace(/\"/g, "");
		next(error);
	} else {
		next();
	}
}

export async function validateSignupRequest(req: Request, res: Response, next: NextFunction) {
	// define validation schema
	const schema = Joi.object({
		firstName: Joi.string().required().label("First Name"),
		lastName: Joi.string().required().label("Last Name"),
		email: Joi.string().email().required().label("Email"),
		password: Joi.string()
			.min(8)
			.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_#]).+$/)
			.required()
			.messages({
				"string.min": "The password must be at least 8 characters long.",
				"string.pattern.base":
					"The password should contain at least one upper case, one number, one lower case character, and one special character.",
			})
			.label("Password"),
		countryId: Joi.number().required().label("Country Id"),
		countryName: Joi.string().required().label("Country Name"),
	});

	// validate request
	const { error } = schema.validate(req.body);

	if (error) {
		// strip string of quotes
		error.message = error.message.replace(/\"/g, "");
		next(error);
	} else {
		// get email from request body
		const { email } = req.body;

		try {
			// check if email already in use and throw error if true
			const isUser = await User.findOne({ email });
			if (isUser) {
				const err = new Error("This Email address is already in use!");
				err.name = "Forbidden";
				throw err;
			}

			next();
		} catch (err: any) {
			next(err);
		}
	}
}

export async function validateRefreshTokenRequest(req: Request, res: Response, next: NextFunction) {
	// get refresh token from request body
	const refreshToken = req.signedCookies.refreshtoken;
	console.log("refresh token", refreshToken, req.signedCookies);

	// define validation schema
	const schema = Joi.object({
		refreshToken: Joi.string().required().label("Refresh Token"),
	});

	// validate request
	const { error } = schema.validate({ refreshToken });

	// check if error in request and throw error
	if (error) {
		error.message = error.message.replace(/\"/g, "");
		next(error);
		return;
	}

	try {
		// create error object
		const err = new Error("Invalid Token");
		err.name = "Unauthorized";

		// verify refresh token and get user's id
		const _id = await verifyRefreshToken(refreshToken);

		// check if user has token in db and throw error if not
		const userSession = await Token.findOne({ _id });
		if (!userSession) throw err;

		// check if token is not same as the one the user has in db
		// throw unauthorized error and delete token from db
		if (userSession.refreshToken !== refreshToken) {
			await Token.deleteOne({ _id });
			throw err;
		}

		// attach id to req body and continue;
		req.body._id = _id;
		next();
	} catch (err: any) {
		next(err);
	}
}

export async function validateLogoutRequest(req: Request, res: Response, next: NextFunction) {
	// get refresh token from request body
	const refreshToken = req.signedCookies.refreshToken;
	// define validation schema
	const schema = Joi.object({
		refresh_token: Joi.string().required().label("Refresh Token"),
	});

	// validate request
	const { error } = schema.validate({ refreshToken });

	// throw error if request is invalid
	if (error) {
		error.message = error.message.replace(/\"/g, "");
		next(error);
		return;
	}

	try {
		// verify refresh token and get user's id
		const _id = await verifyRefreshToken(refreshToken);

		// attach id to req body and continue;
		req.body._id = _id;
		next();
	} catch (err: any) {
		next(err);
	}
}

export async function validateSendPasswordResetLinkRequest(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const { email } = req.params;

	const schema = Joi.object({
		email: Joi.string().email().required().label("Email"),
	});

	const { error } = schema.validate({ email });

	if (error) {
		error.message = error.message.replace(/\"/g, "");
		next(error);
		return;
	}

	try {
		const user = await User.findOne({ email });
		req.body._id = user?._id;
		next();
	} catch (err) {}
}

export async function validatePasswordResetRequest(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const { resetToken, password, user_id } = req.body;

	const schema = Joi.object({
		reset_token: Joi.string().required().label("Reset Token"),
		password: Joi.string().min(8).required().label("Password"),
		user_id: Joi.string().required().label("User Id"),
	});

	const { error } = schema.validate({ resetToken, password, user_id });

	if (error) {
		error.message = error.message.replace(/\"/g, "");
		next(error);
		return;
	}

	let errorFlag = 0;

	try {
		// check if reset token in db
		const user = await PasswordResetToken.findOne({ _id: user_id });

		if (!user) {
			errorFlag = 1;
			throw Error("Invalid request");
		}

		// compare reset token to see if they match
		const isTokenValid = await bcrypt.compare(resetToken, user.resetToken);

		if (!isTokenValid) {
			errorFlag = 2;
			await PasswordResetToken.deleteOne({ _id: user_id });
			throw Error("Invalid Token");
		}

		next();
	} catch (err: any) {
		if (errorFlag === 1) err.name = "Forbidden";
		else if (errorFlag === 2) err.name = "Unauthorized";
		next(err);
	}
}
