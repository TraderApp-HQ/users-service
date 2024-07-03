import JWT from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import "dotenv/config";
import { IAccessToken } from "../../config/interfaces";
import { ErrorMessage, TOKEN_ATTRIBUTES } from "../../config/constants";
import VerificationToken from "../../models/VerificationToken";
import { getFrontendUrl } from "../controllers";

interface IValidateUserVerificationToken {
	userId: string;
	verificationToken: string;
}

/* A function to generate access token.
 ** It generates and returns an access token and throws an error if something goes wrong
 */
export async function generateAccessToken(payload: IAccessToken) {
	return await new Promise(async (resolve, reject) => {
		const secret = process.env.ACCESS_TOKEN_SECRET ?? "";

		// prepare and sign access token
		const options = {
			expiresIn: TOKEN_ATTRIBUTES.ACCESS_TOKEN_EXPIRES,
			issuer: TOKEN_ATTRIBUTES.TOKEN_ISSUER,
		};
		JWT.sign(payload, secret, options, (err, token) => {
			if (err) {
				reject(err);
				return;
			}

			resolve(token);
		});
	});
}

/* A function to generate refresh token.
 ** It generates and returns a refresh token and throws an error if something goes wrong.
 */
export async function generateRefreshToken(payload: any) {
	return await new Promise(async (resolve, reject) => {
		const secret = process.env.REFRESH_TOKEN_SECRET ?? "";

		// prepare and sign refresh token
		const options = {
			expiresIn: TOKEN_ATTRIBUTES.REFRESH_TOKEN_EXPIRES,
			issuer: TOKEN_ATTRIBUTES.TOKEN_ISSUER,
		};
		JWT.sign(payload, secret, options, (err, token) => {
			if (err) {
				reject(err);
				return;
			}

			resolve(token);
		});
	});
}

// A function to verify refresh token
export async function verifyRefreshToken(refreshToken: string) {
	return await new Promise(async (resolve, reject) => {
		const secret = process.env.REFRESH_TOKEN_SECRET ?? "";

		JWT.verify(refreshToken, secret, (err, payload) => {
			// throw error if error
			if (err) {
				err.name = ErrorMessage.UNAUTHORIZED;
				err.message = ErrorMessage.INVALID_TOKEN;
				reject(err);
				return;
			}

			// return payload
			const { id } = payload as IAccessToken;
			resolve(id);
		});
	});
}

// a function to format response for token issued
export function issueTokenResponse(accessToken: string) {
	return {
		accessToken,
		tokenType: "bearer",
		expires: TOKEN_ATTRIBUTES.EXPIRES_TIMESTAMP,
	};
}

// a function to generate password reset token
export async function generateToken() {
	const { randomBytes } = await import("node:crypto");
	const buf = randomBytes(64);
	return buf.toString("hex");
}

export async function generateUserVerificationToken(userId: string) {
	// check if user already has a reset_token and delete it
	const isToken = await VerificationToken.findOne({ _id: userId });
	if (isToken) await VerificationToken.deleteOne({ _id: userId });
	const token = await generateToken();

	// // hash reset_token
	const salt = await bcrypt.genSalt(10);
	const hashedToken = await bcrypt.hash(token, salt);

	// insert reset_token in db
	await VerificationToken.create({ _id: userId, verificationToken: hashedToken });
	return token;
}

export async function validateUserVerificationToken({
	userId,
	verificationToken,
}: IValidateUserVerificationToken) {
	// check if reset token in db
	const user = await VerificationToken.findOne({ _id: userId });
	if (!user) throw Error("Invalid request");

	// compare reset token to see if they match
	const isTokenValid = await bcrypt.compare(verificationToken, user.verificatonToken);
	if (!isTokenValid) {
		await VerificationToken.deleteOne({ _id: userId });
		throw Error("Invalid Token");
	}
}

export function generateOTP(param?: { length?: number }): string {
	const length = param?.length ?? 6;
	if (length <= 0) {
		throw new Error("Length must be a positive integer");
	}

	// Calculate the maximum value for the given length
	const max = Math.pow(10, length);

	// Generate a random number between 0 and (max - 1)
	const randomNumber = Math.floor(Math.random() * max);

	// Ensure the OTP has the specified length by padding with leading zeros if necessary
	const otp = randomNumber.toString().padStart(length, "0");
	return otp;
}

// A function to verify access token
export async function verifyAccessToken(accessToken: string) {
	const secret = process.env.ACCESS_TOKEN_SECRET ?? "";

	return await new Promise((resolve, reject) => {
		JWT.verify(accessToken, secret, (err, payload) => {
			if (err) {
				err.name = "Unauthorized";
				err.message = "Invalid Token";
				reject(err);
			}

			resolve(payload);
		});
	});
}

export async function generateResetUrl(_id: string): Promise<string> {
	const frontendUrl = getFrontendUrl();
	const verificationToken = await generateUserVerificationToken(_id);

	// TODO: send email  by calling sqs
	const url = `${frontendUrl}/auth/password/reset?token=${verificationToken}&id=${_id}`;
	return url;
}
