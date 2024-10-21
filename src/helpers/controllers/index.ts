import { logger } from "@traderapp/shared-resources";
import { Response } from "express";
import "dotenv/config";
import { NotificationChannel } from "../../config/enums";
import OneTimePassword from "../../models/OneTimePassword";
import { IUserModel } from "../../models/User";
import {
	generateAccessToken,
	generateOTP,
	generateRefreshToken,
	issueTokenResponse,
} from "../tokens";
import { IVerifyOtp } from "../../controllers/AuthController/config";
import {
	ENVIRONMENTS,
	REFRESH_TOKEN_EXPIRES,
	accessTokenCookieOptions,
	refreshTokenCookieOptions,
} from "../../config/constants";
import Token from "../../models/RefreshToken";
import { IAccessToken } from "../../config/interfaces";
import { publishMessageToQueue } from "../../utils/helpers/SQSClient/helpers";
import { IQueueMessageBodyObject, IQueueMessage } from "../../utils/helpers/types";

interface ISendOtp {
	userData: IUserModel;
	channels: NotificationChannel[];
}

interface IUserOtp {
	userId: string;
	channels: NotificationChannel[];
}

export async function sendOTP({ userData, channels }: ISendOtp) {
	// generate otp and insert into db
	const insertData = channels.map((channel) => ({
		_id: userData._id,
		otp: generateOTP(),
		channel,
	}));
	const otpExist = await OneTimePassword.findOne({ _id: userData._id }).select("_id");
	if (otpExist) {
		await Promise.all(
			channels.map(async (channel) => {
				await OneTimePassword.updateOne(
					{ _id: userData._id, channel },
					{ otp: generateOTP() },
					{ upsert: true },
				);
			}),
		);
	} else {
		await OneTimePassword.create(insertData);
	}

	// publish message in parralel to notification-service to send notification
	const promises = insertData.map((data) => {
		const message: IQueueMessageBodyObject = {
			recipients: [{ firstName: userData.firstName, emailAddress: userData.email }],
			message: data.otp,
			event: "OTP",
		};
		return {
			message,
			promise: publishMessageToQueue({
				queueUrl: process.env.EMAIL_OTP_QUEUE ?? "",
				message,
			}),
		};
	});
	await Promise.allSettled(promises.map(async (promise) => promise.promise));
	console.log("Published messages to queue", {
		messages: promises.map((promise) => JSON.stringify(promise.message)),
	});
}

export async function verifyOTP({ userId, data }: IVerifyOtp) {
	// Extract the channels from the data array
	const channels = data.map((otpData) => otpData.channel);

	// Fetch OTPs from the database matching the userId and channels
	const userOTPs = await OneTimePassword.find({
		_id: userId,
		channel: { $in: channels },
	});

	if (userOTPs.length !== data.length) return false;

	// Log the fetched OTPs for debugging
	logger.log(`Fetched OTPs for verification: ${JSON.stringify(userOTPs)}`);

	// Create a map of channels to OTPs from the passed data
	const otpMap = new Map<string, string>();
	data.forEach((otpData) => {
		otpMap.set(otpData.channel, otpData.otp);
	});

	// Verify that the OTPs passed match the OTPs stored in the db for each channel
	const isValid = userOTPs.every((storedOtp) => {
		const passedOtp = otpMap.get(storedOtp.channel);
		return passedOtp && passedOtp === storedOtp.otp;
	});

	// Log the verification result for debugging
	logger.log(`OTP verification result: ${isValid}`);

	return isValid;
}

export async function deleteOtp({ userId, channels }: IUserOtp): Promise<void> {
	try {
		await OneTimePassword.deleteMany({
			_id: userId,
			channel: { $in: channels },
		});
		logger.log(`Deleted OTPs for userId: ${userId} and channels: ${channels.join(", ")}`);
	} catch (error) {
		console.error(
			`Error deleting OTPs for userId: ${userId} and channels: ${channels.join(", ")}`,
			error,
		);
		throw error;
	}
}

export function getUserObject(data: IUserModel) {
	return {
		id: data._id,
		firstName: data.firstName,
		lastName: data.lastName,
		email: data.email,
		isPhoneVerified: data.isPhoneVerified,
		isEmailVerified: data.isEmailVerified,
		isIdVerified: data.isIdVerified,
		role: data.role,
		referralCode: data.referralCode,
	};
}
export async function buildResponse(res: Response, data: IUserModel) {
	const user = getUserObject(data) as IAccessToken;
	// generate access and refreh tokens
	const accessToken = (await generateAccessToken(user)) as string;
	const refreshToken = (await generateRefreshToken({ id: user.id })) as string;

	// set time for refreshToken expiry
	const expireAt = new Date();
	expireAt.setSeconds(expireAt.getSeconds() + REFRESH_TOKEN_EXPIRES);
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
	res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);
	res.cookie("accessToken", accessToken, accessTokenCookieOptions);

	return response;
}

export function getFrontendUrl() {
	return ENVIRONMENTS[process.env.NODE_ENV ?? "development"].frontendUrl;
}
