import { NotificationChannel } from "../../config/enums";

export interface IOtpBody {
	otp: string;
	channel: NotificationChannel;
}
export enum VerificationType {
	VERIFY = "VERIFY",
	UPDATE = "UPDATE",
	AUTHENTICATE = "AUTHENTICATE",
}
export interface IVerifyOtp {
	userId: string;
	data: IOtpBody[];
	verificationType?: VerificationType[];
	verificationToken?: string;
}
