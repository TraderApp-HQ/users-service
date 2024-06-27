import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import "dotenv/config";
import User from "../../models/User";
import Token from "../../models/RefreshToken";
import VerificationToken from "../../models/VerificationToken";
import { generateUserVerificationToken } from "../../helpers/tokens";
import { ErrorMessage, ResponseMessage, RESPONSE_FLAGS } from "../../config/constants";
import { apiResponseHandler, logger } from "@traderapp/shared-resources";
import { NotificationChannel } from "../../config/enums";
import {
	buildResponse,
	deleteOtp,
	getFrontendUrl,
	getUserObject,
	sendOTP,
	verifyOTP,
} from "../../helpers/controllers";
import { IVerifyOtp, VerificationType } from "./config";
import { generatePassword } from "../../utils/generatePassword";
import { sendEmail } from "../../helpers/mail";

export async function signupHandler(req: Request, res: Response, next: NextFunction) {
	try {
		const data = await User.create(req.body);
		logger.debug(`New user created , ${JSON.stringify(data)}`);

		// TODO: replace with feature flag
		const isOtpEnabled = false;
		if (isOtpEnabled) {
			await sendOTP({ userData: data, channels: [NotificationChannel.EMAIL] });
		}

		const resObj = getUserObject(data);
		res.status(200).json(
			apiResponseHandler({
				object: resObj,
				message: "A one time password has been sent to your email!",
			}),
		);
	} catch (err) {
		next(err);
	}
}

export async function createUserHandler(req: Request, res: Response, next: NextFunction) {
	try {
		const defaultPassword = generatePassword();
		req.body.password = defaultPassword;
		const data = await User.create(req.body);
		logger.debug(`New user created , ${JSON.stringify(data)}`);
		const { email, role, _id } = data;
		const frontendUrl = getFrontendUrl();
		const link = `${frontendUrl}/auth/password/reset?id=${_id}`;
		const payload = { email, role, link };

		// TODO: use nodemailer for test
		if (process.env.EMAIL_ENV === "TEST") {
			await sendEmail({
				mailType: "newuser",
				payload,
				subject: "Welcome to trade App",
				recipientEmails: [data.email],
			});
		}

		const resObj = getUserObject(data);
		res.status(200).json(
			apiResponseHandler({
				object: resObj,
				message: "New User Account created!",
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

		// TODO: replace with feature flag
		const isOtpEnabled = false;
		if (isOtpEnabled) {
			await sendOTP({ userData: data, channels: [NotificationChannel.EMAIL] });
		}

		const resObj = getUserObject(data);
		res.status(200).json(
			apiResponseHandler({
				object: resObj,
				message: "A one time password has been sent to your email!",
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
		res.cookie("accessToken", "", { maxAge: 0 });
		res.status(200).json(apiResponseHandler({ message: "Logout successful!" }));
	} catch (err) {
		next(err);
	}
}

export async function refreshTokenHandler(req: Request, res: Response, next: NextFunction) {
	const { _id } = req.body;

	try {
		const data = await User.findOne({ _id });
		const tokenRes = await buildResponse(res, data!);
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
			const verificationToken = await generateUserVerificationToken(_id);
			const frontendUrl = getFrontendUrl();

			// TODO: send email  by calling sqs
			const url = `${frontendUrl}/auth/password/reset?token=${verificationToken}&id=${_id}`;
			console.log("Password reset token: ", verificationToken);
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
	const { userId, password } = req.body;

	try {
		// hash password
		const salt = await bcrypt.genSalt(10);
		const hashed = await bcrypt.hash(password, salt);

		// update password
		await User.updateOne({ _id: userId }, { $set: { password: hashed } });

		// delete reset token
		await VerificationToken.deleteOne({ _id: userId });

		// delete refresh token
		const hasRefreshToken = await Token.findOne({ _id: userId });
		if (hasRefreshToken) await Token.deleteOne({ _id: userId });

		// get user email
		const user = await User.findOne({ _id: userId });

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

export async function verifyOtpHandler(req: Request, res: Response, next: NextFunction) {
	const { userId, data, verificationType } = req.body as IVerifyOtp;
	try {
		// TODO: replace with feature flag
		const isOtpEnabled = false;
		if (isOtpEnabled) {
			const isOtpVerified = await verifyOTP({ userId, data });
			if (!isOtpVerified) {
				const err = new Error("OTP is invalid");
				err.name = RESPONSE_FLAGS.notfound;
				throw err;
			}
			// delete otps
			await deleteOtp({ userId, channels: data.map((val) => val.channel) });
		} else {
			// default otp for internal use
			const validOtps = data.filter((obj) => obj.otp === "123456");
			if (validOtps.length !== data.length) {
				const err = new Error("OTP is invalid");
				err.name = RESPONSE_FLAGS.notfound;
				throw err;
			}
		}

		// mostly used for verifications. e.g email, phoneNumber
		if (verificationType?.includes(VerificationType.UPDATE)) {
			const updateFields: Partial<{ isEmailVerified: boolean; isPhoneVerified: boolean }> =
				{};
			data.forEach(({ channel }) => {
				if (channel === NotificationChannel.EMAIL) {
					updateFields.isEmailVerified = true;
				}
				if (channel === NotificationChannel.SMS) {
					updateFields.isPhoneVerified = true;
				}
			});

			if (Object.keys(updateFields).length > 0) {
				await User.updateOne({ _id: userId }, { $set: updateFields });
			}
		}

		// mostly used for signup and login
		let tokenRes;
		if (verificationType?.includes(VerificationType.AUTHENTICATE)) {
			const data = await User.findOne({ _id: userId });
			tokenRes = await buildResponse(res, data!);
		}

		res.status(200).json(
			apiResponseHandler({
				object: tokenRes,
				message: "OTP verified successfully!",
			}),
		);
	} catch (err) {
		next(err);
	}
}
