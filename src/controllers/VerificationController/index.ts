import { apiResponseHandler } from "@traderapp/shared-resources";
import { Request, Response, NextFunction } from "express";

export async function sendEmailVerificationCodeHandler(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	res.status(200).json(
		apiResponseHandler({
			message: "Send email verification code handler working!",
		}),
	);
}

export async function sendPhoneVerificationCodeHandler(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	res.status(200).json(
		apiResponseHandler({
			message: "Send phone verification code handler working!",
		}),
	);
}

export async function confirmEmailVerificationCodeHandler(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	res.status(200).json(
		apiResponseHandler({
			message: "Confirm email verification code handler working!",
		}),
	);
}

export async function confirmPhoneVerificationCodeHandler(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	res.status(200).json(
		apiResponseHandler({
			message: "Confirm phone verification code handler working!",
		}),
	);
}
