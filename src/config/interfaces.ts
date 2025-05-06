import {
	NotificationChannel,
	Platform,
	PlatformActions,
	PlatformFollowStatus,
	Role,
	Status,
	TaskCategory,
	TaskStatus,
	TaskType,
	UserTaskStatus,
} from "./enums";
import { ReferralRank } from "./constants";

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
	parentId?: string;
	referralRank?: ReferralRankType;
	personalATC?: number;
	communityATC?: number;
	isTestReferralTrackingInProgress?: boolean;
}

export interface IPlatformsFollower {
	id: string;
	userId: string;
	platformName: Platform;
	username: string;
	followStatus: PlatformFollowStatus;
	fullName: string;
	avatarUrl: string;
	followersCount: string;
}

export interface ISocialPageFollower {
	id: string;
	username: string;
	fullName: string;
	avatarUrl: string;
	followersCount: string;
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
	userId: string; // The user (descendant)
	parentId: string; // The ancestor (direct parent)
	level: number; // Level of the ancestor (1 for direct parent, 2 for grandparent, etc.)
	createdAt: Date;
}

export interface ITaskPlatform {
	id: string;
	name: Platform;
	logoUrl: string;
	isActive: boolean;
	supportedActions: PlatformActions[];
	categories: TaskCategory[];
}

export interface ITask {
	id: string;
	title: string;
	description: string;
	objective?: string;
	taskType: TaskType;
	category: TaskCategory;
	platformId?: string;
	platformName?: Platform;
	link?: string;
	expectedActions?: PlatformActions[];
	points: number;
	startDate?: Date;
	dueDate?: Date;
	status: TaskStatus;
}

export interface IUserTask {
	id: string;
	userId: string;
	taskId: string;
	taskPoints: number;
	expectedActions?: PlatformActions[];
	status: UserTaskStatus;
}

export interface OtpRateLimit {
	channel: NotificationChannel;
	attempts: number;
	rateLimitStart: Date;
}

export type ReferralRankType = (typeof ReferralRank)[keyof typeof ReferralRank];

export interface IUserData {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	referralRank?: ReferralRankType;
}

export interface IRankCriteriaStatus {
	completed: boolean;
	minValue: number;
}

export interface IRankCriteria {
	personalATC: number;
	communityATC: number;
	communitySize: number;
	isTestReferralTracking?: boolean;
}

export type IRankData = {
	[rank in ReferralRankType]: {
		personalATC: IRankCriteriaStatus;
		communityATC: IRankCriteriaStatus;
		communitySize: IRankCriteriaStatus;
	};
};

export interface IReferralData {
	user: IUserData;
	referrals: IUserData[];
	isTestReferralTracking?: boolean;
}
