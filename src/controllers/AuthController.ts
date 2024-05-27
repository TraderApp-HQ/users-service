import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";
import Token from "../models/RefreshToken";
import PasswordResetToken from "../models/PasswordResetToken";
import {
	generateAccessToken,
	generateRefreshToken,
	issueTokenResponse,
	generateResetToken,
} from "../utils/token-functions";
import { ErrorMessage, ResponseMessage, cookieOptions } from "../config/constants";
import { apiResponseHandler } from "@traderapp/shared-resources";
import { HttpStatusCode } from "axios";

async function buildResponse(res: Response, data: any) {
	const user = {
		id: data._id,
		firstName: data.firstName,
		lastName: data.lastName,
		email: data.email,
		isPhoneVerified: data.isPhoneVerified,
		isEmailVerified: data.isEmailVerified,
		isIdVerified: data.isIdVerified,
		role: data.role,
	};

	// generate access and refreh tokens
	const accessToken = (await generateAccessToken(user)) as string;
	const refreshToken = (await generateRefreshToken({ id: user.id })) as string;

	// set time for refreshToken expiry
	const expireAt = new Date();
	expireAt.setSeconds(expireAt.getSeconds() + 60 * 2);
	expireAt.toISOString();

	// check if user already has refresh_token in db
	const isUserToken = await Token.findOne({ _id: user.id });

	// update refresh_token if true, else insert one
	if (isUserToken) {
		await Token.updateOne({ _id: user.id }, { $set: { refreshToken, expireAt } });
	} else {
		await Token.create({ _id: user.id, refreshToken, expireAt });
	}

	// format json response
	// const res = issueTokenResponse(access_token, refresh_token);
	const response = issueTokenResponse(accessToken);
	res.cookie("refreshtoken", refreshToken, cookieOptions);

	return response;
}

export async function signupHandler(req: Request, res: Response, next: NextFunction) {
	try {
		const data = await User.create(req.body);
		const tokenRes = await buildResponse(res, data);
		// saveRefreshTokenCookie(res, tokenRes.refresh_token)
		res.status(200).json(
			apiResponseHandler({
				object: tokenRes,
				message: ResponseMessage.SIGNUP,
			}),
		);
	} catch (err) {
		next(err);
	}
}

export async function loginHandler(req: Request, res: Response, next: NextFunction) {
	const { email, password } = req.body;

	try {
		const data = await User.login(email, password);

		if (!data) {
			const error = new Error(ErrorMessage.INVALID_LOGIN);
			error.name = ErrorMessage.NOTFOUND;
			throw error;
		}
		const tokenRes = await buildResponse(res, data);
		res.status(200).json(
			apiResponseHandler({
				object: tokenRes,
				message: ResponseMessage.LOGIN,
			}),
		);
	} catch (err: any) {
		next(err);
	}
}

export async function logoutHandler(req: Request, res: Response, next: NextFunction) {
	const { _id } = req.body;

	try {
		await Token.deleteOne({ _id });
		res.cookie("refreshToken", "", { maxAge: 0 });
		res.status(204).json(apiResponseHandler());
	} catch (err) {
		next(err);
	}
}

export async function refreshTokenHandler(req: Request, res: Response, next: NextFunction) {
	const { _id } = req.body;

	try {
		const data = await User.findOne({ _id });
		const tokenRes = await buildResponse(res, data);
		res.status(200).json(
			apiResponseHandler({
				object: tokenRes,
			}),
		);
	} catch (err) {
		next(err);
	}
}

export async function sendPasswordResetLinkHandler(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const { _id } = req.body;

	try {
		if (_id) {
			// check if user already has a reset_token and delete it
			const isToken = await PasswordResetToken.findOne({ _id });
			if (isToken) await PasswordResetToken.deleteOne({ _id });

			const reset_token = await generateResetToken();

			// hash reset_token
			const salt = await bcrypt.genSalt(10);
			const hashed = await bcrypt.hash(reset_token, salt);

			// insert reset_token in db
			await PasswordResetToken.create({ _id, reset_token: hashed });

			// send email
			const url = `https://traderapp.finance/account/password-reset?token=${reset_token}&id=${_id}`;
			console.log("password reset token is: ", reset_token);
			console.log("stored hashed is : ", hashed);
		}

		res.status(200).json(
			apiResponseHandler({
				message: ResponseMessage.PASSWORD_RESET_SENT,
			}),
		);
	} catch (err) {
		next(err);
	}
}

export async function passwordResetHandler(req: Request, res: Response, next: NextFunction) {
	const { user_id, password } = req.body;

	try {
		// hash password
		const salt = await bcrypt.genSalt(10);
		const hashed = await bcrypt.hash(password, salt);

		// update password
		await User.updateOne({ _id: user_id }, { $set: { password: hashed } });

		// delete reset token
		await PasswordResetToken.deleteOne({ _id: user_id });

		// delete refresh token
		const hasRefreshToken = await Token.findOne({ _id: user_id });
		if (hasRefreshToken) await Token.deleteOne({ _id: user_id });

		// get user email
		const user = await User.findOne({ _id: user_id });

		// send mail to user email address

		// send response
		res.status(200).json(
			apiResponseHandler({
				message: ResponseMessage.PASSWORD_RESET,
			}),
		);
	} catch (err) {
		next(err);
	}
}
