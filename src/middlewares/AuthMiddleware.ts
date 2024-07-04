import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { validateUserVerificationToken, verifyRefreshToken } from "../helpers/tokens";
import Token from "../models/RefreshToken";
import User from "../models/User";
import { RESPONSE_FLAGS } from "../config/constants";
import { NotificationChannel, Role } from "../config/enums";
import { IVerifyOtp, VerificationType } from "../controllers/AuthController/config";
import { isValidObjectId } from "mongoose";

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
				err.name = RESPONSE_FLAGS.forbidden;
				throw err;
			}

			next();
		} catch (err: any) {
			next(err);
		}
	}
}

export async function validateCreateUserRequest(req: Request, res: Response, next: NextFunction) {
	// define validation schema
	const roleSchema = Joi.string().valid(...Object.values(Role));

	const schema = Joi.object({
		firstName: Joi.string().required().label("First Name"),
		lastName: Joi.string().required().label("Last Name"),
		email: Joi.string().email().required().label("Email"),
		role: Joi.array().items(roleSchema).min(1).required(),
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
				err.name = RESPONSE_FLAGS.forbidden;
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
	const refreshToken = req.signedCookies.refreshToken;

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
		const err = new Error("No valid session found!");
		err.name = RESPONSE_FLAGS.forbidden;

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
		refreshToken: Joi.string().required().label("Refresh Token"),
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
	const { email } = req.body;

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
	} catch (err) {
		next(err);
	}
}

export async function validatePasswordResetRequest(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const { verificationToken, password, userId } = req.body;

	const schema = Joi.object({
		verificationToken: Joi.string().required().label("Verification Token"),
		password: Joi.string().min(8).required().label("Password"),
		userId: Joi.string().required().label("User Id"),
	});

	const { error } = schema.validate({ verificationToken, password, userId });

	if (error) {
		error.message = error.message.replace(/\"/g, "");
		next(error);
		return;
	}

	if (!isValidObjectId(userId)) {
		const err = new Error("User Id is an invalid format");
		err.name = RESPONSE_FLAGS.validationError;
		next(err);
		return;
	}

	try {
		await validateUserVerificationToken({ userId, verificationToken });
		next();
	} catch (err: any) {
		err.name = RESPONSE_FLAGS.forbidden;
		next(err);
	}
}

export async function validateVerifyOTPRequest(req: Request, res: Response, next: NextFunction) {
	const { userId, data, verificationType } = req.body as IVerifyOtp;

	const dataSchema = Joi.object({
		otp: Joi.string().required(),
		channel: Joi.string()
			.valid(...Object.values(NotificationChannel))
			.required(),
	});
	const verificationTypeSchema = Joi.string().valid(...Object.values(VerificationType));
	const schema = Joi.object({
		userId: Joi.string().required(),
		data: Joi.array().items(dataSchema).min(1).required(),
		verificationType: Joi.array().items(verificationTypeSchema).min(1),
	});

	const { error } = schema.validate({ userId, data, verificationType });

	if (error) {
		error.message = error.message.replace(/\"/g, "");
		next(error);
		return;
	}

	next();
}
