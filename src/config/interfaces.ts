import { NotificationChannel, Role, Status } from "./enums";

export interface IUser {
	email: string;
	password: string;
	phone?: string;
	firstName: string;
	lastName: string;
	countryId: number;
	dob: string;
	isEmailVerified?: boolean;
	isPhoneVerified?: boolean;
	isIdVerified?: boolean;
	role: Role[];
	status: Status;
	referralCode: string;
}

export interface ICountry {
	_id: number;
	name: string;
	code: string;
	flag: string;
	capital: string;
	dial_code: string;
	currency: { name: string; code: string; symbol: string };
	continent: string;
}

export interface Payload {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	dob: string;
	isPhoneVerified: boolean;
	isEmailVerified: boolean;
	isIdVerified: boolean;
	role: Role;
}

export interface RefreshToken {
	refreshToken: string;
	expireAt: Date;
}

export interface VerificationToken {
	verificationToken: string;
	expireAt: Date;
}

export interface OneTimePassword {
	otp: string;
	verificationToken: string;
	expireAt: Date;
	channel: NotificationChannel;
}

export interface IAccessToken {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	isPhoneVerified: boolean;
	isEmailVerified: boolean;
	isIdVerified: boolean;
	role: Role[];
}

export interface UserRelationship {
	user: string; // The user (descendant)
	parent: string; // The ancestor (direct parent)
	level: number; // Level of the ancestor (1 for direct parent, 2 for grandparent, etc.)
	createdAt: Date;
}
