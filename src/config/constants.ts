import "dotenv/config";
import { apiDocumentationResponseObject } from "@traderapp/shared-resources";

interface EnvProperty {
	slug: string;
	frontendUrl: string;
}

export const ENVIRONMENTS: Record<string, EnvProperty> = Object.freeze({
	development: {
		slug: "dev",
		frontendUrl: "https://web-dashboard-dev.traderapp.finance",
	},
	test: {
		slug: "dev",
		frontendUrl: "https://web-dashboard-dev.traderapp.finance",
	},
	staging: {
		slug: "staging",
		frontendUrl: "https://web-dashboard-staging.traderapp.finance",
	},
	production: {
		slug: "prod",
		frontendUrl: "https://dashboard.traderapp.finance",
	},
});

export const TOKEN_ATTRIBUTES = {
	ACCESS_TOKEN_EXPIRES: "15m",
	REFRESH_TOKEN_EXPIRES: "7d",
	EXPIRES_TIMESTAMP: 15 * 60,
	TOKEN_ISSUER: "traderapp.finance",
};

export const ResponseType = {
	SUCCESS: "success",
	ERROR: "error",
};

export const ResponseMessage = {
	LOGIN: "Login was successful",
	LOGOUT: "Logout was successful",
	SIGNUP: "Signup was successful",
	PASSWORD_RESET_SENT: "Password reset link has been sent",
	PASSWORD_RESET: "Password was reset successfully!",
	GET_USERS: "Users Fetched successfully",
	SEARCH_USERS: "Users Searched successfully",
	GET_USER: "User Fetched successfully",
	UPDATE_USER: "User Updated successfully",
	DEACTIVATE_USER: "User Deactivated successfully",
	ACTIVATE_USER: "User Activated successfully",
	GET_REFERRALS: "Referrals Fetched successfully",
	GET_REFERRALS_SUMMARY: "Referrals summary fetched",
	TRACK_USER_REFERRALS: "Referrals successfully tracked",
};

export const ErrorMessage = {
	INVALID_LOGIN: "Invalid login credentials!",
	DEACTIVATED: "Your account has been deactivated. Please, contact support!",
	INVALID_TOKEN: "Invalid Token",
	INVALID_USER: "Invalid User",
	NOTFOUND: "NotFound",
	UNAUTHORIZED: "Unauthorized",
	INVALID_REFERRAL_CODE: "Invalid referral code.",
};

export const REFRESH_TOKEN_EXPIRES = 7 * 24 * 60 * 60; // 7 days
export const VERIFICATION_TOKEN_EXPIRES = 1 * 24 * 60 * 60; // 1 day
export const OTP_EXPIRES = 60 * 10; // 10 minutes
export const OTP_RATE_LIMIT_EXPIRES = 60 * 60; // 1 hour
export const MAX_OTP_ATTEMPTS = 5;

export const refreshTokenCookieOptions = {
	httpOnly: true,
	// secure: process.env.NODE_ENV === "production",
	secure: false,
	signed: true,
	maxAge: REFRESH_TOKEN_EXPIRES * 1000,
};

export const accessTokenCookieOptions = {
	// secure: process.env.CLIENT ? true : false,
	secure: false,
	signed: true,
	maxAge: 15 * 60 * 1000, // Cookie will expire in 15 minutes
};

export const RESPONSE_TAGS = {
	auth: "Auth",
	users: "Users",
	verification: "Verification",
	country: "Country",
	referrals: "Referrals",
};

export const RESPONSE_CODES = {
	ok: "200",
	created: "201",
	badRequest: "400",
	unauthorized: "401",
	serverError: "500",
	notFound: "404",
	forbidden: "403",
	request_timeout: "408",
	conflict: "409",
};

export const RESPONSE_FLAGS = {
	unauthorized: "Unauthorized",
	validationError: "ValidationError",
	forbidden: "Forbidden",
	notfound: "NotFound",
};

export const DOC_RESPONSE = {
	SERVERERROR: apiDocumentationResponseObject("Internal Server Error"),
	UNAUTHORIZED: apiDocumentationResponseObject("Error: Unauthorized"),
	BADREQUEST: apiDocumentationResponseObject("Error: Bad Request"),
	SUCCESS: apiDocumentationResponseObject("Success"),
	LOGOUT_SUCCESS: apiDocumentationResponseObject("User Logged out successfully!"),
	LOGIN_SUCCESS: apiDocumentationResponseObject("User Logged in successfully!"),
	PASSWORD_RESET_LINK_SUCCESS: apiDocumentationResponseObject(
		"Password Resetted in successfully!",
	),
	REFRESH_TOKEN_SUCCESS: apiDocumentationResponseObject("Refresh Token requested successfully!"),
	REGISTER_SUCCESS: apiDocumentationResponseObject("User created successfully!"),
};

export const ROUTES = {
	login: "/login",
	signup: "/signup",
	createUser: "/createuser",
	logout: "/logout",
	refreshToken: "/refresh-token",
	passwordReset: "/password-reset",
	passwordResetLink: "/password-reset-link",
	getUser: "/me",
	getAllUsers: "/all",
	updateUser: "/update",
	toggleuserActivation: "/toggle-activation",
	searchUser: "/search",
	verifyOtp: "/verify-otp",
	referralStats: "/referral-stats",
	inviteFriends: "/invite-friends",
	communityStats: "/community-stats",
	referrals: "/referrals",
	sendOtp: "/send-otp",
	referralOverview: "/referral-overview",
	trackReferrals: "/track-referrals",
};

export const PAGINATION = {
	PAGE: 1,
	LIMIT: 10,
};

export const EXCLUDE_FIELDS = {
	USER: "-_id -password",
};

export const ReferralRank = {
	TA_RECRUIT: "TA-Recruit",
	TA_LIEUTENANT: "TA-Lieutenant",
	TA_CAPTAIN: "TA-Captain",
	TA_MAJOR: "TA-Major",
	TA_COLONEL: "TA-Colonel",
	TA_GENERAL: "TA-General",
	TA_FIELD_MARSHAL: "TA-Field-Marshal",
} as const;

export const RANK_REQUIREMENTS = {
	[ReferralRank.TA_RECRUIT]: {
		personalATC: 50,
		communityATC: 0,
		communitySize: 0,
		testCommunitySize: 0,
	},
	[ReferralRank.TA_LIEUTENANT]: {
		personalATC: 100,
		communityATC: 1000,
		communitySize: 20,
		testCommunitySize: 2,
	},
	[ReferralRank.TA_CAPTAIN]: {
		personalATC: 500,
		communityATC: 5000,
		communitySize: 100,
		testCommunitySize: 4,
	},
	[ReferralRank.TA_MAJOR]: {
		personalATC: 1000,
		communityATC: 20000,
		communitySize: 400,
		testCommunitySize: 6,
	},
	[ReferralRank.TA_COLONEL]: {
		personalATC: 2000,
		communityATC: 50000,
		communitySize: 800,
		testCommunitySize: 8,
	},
	[ReferralRank.TA_GENERAL]: {
		personalATC: 5000,
		communityATC: 100000,
		communitySize: 1500,
		testCommunitySize: 10,
	},
	[ReferralRank.TA_FIELD_MARSHAL]: {
		personalATC: 10000,
		communityATC: 500000,
		communitySize: 5000,
		testCommunitySize: 12,
	},
} as const;
