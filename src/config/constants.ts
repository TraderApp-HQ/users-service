import "dotenv/config";
import { apiDocumentationResponseObject } from "@traderapp/shared-resources";

interface EnvProperty {
	slug: string;
	frontendUrl: string;
}

export const ENVIRONMENTS: Record<string, EnvProperty> = Object.freeze({
	development: {
		slug: "dev",
		frontendUrl: "https://users-dashboard-dev.traderapp.finance",
	},
	staging: {
		slug: "staging",
		frontendUrl: "https://users-dashboard-staging.traderapp.finance",
	},
	production: {
		slug: "prod",
		frontendUrl: "https://dashboard.traderapp.finance",
	},
});

export const TOKEN_ATTRIBUTES = {
	ACCESS_TOKEN_EXPIRES: "2m",
	REFRESH_TOKEN_EXPIRES: "30d",
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
	PASSWORD_RESET_SENT: "Password rest link has been sent",
	PASSWORD_RESET: "Password was reset successfully!",
	GET_USERS: "Users Fetched successfully",
	SEARCH_USERS: "Users Searched successfully",
	GET_USER: "User Fetched successfully",
	UPDATE_USER: "User Updated successfully",
};

export const ErrorMessage = {
	INVALID_LOGIN: "Invalid login credentials!",
	INVALID_TOKEN: "Invalid Token",
	INVALID_USER: "Invalid User",
	NOTFOUND: "NotFound",
	UNAUTHORIZED: "Unauthorized",
};

export const REFRESH_TOKEN_EXPIRES = 7 * 24 * 60 * 60; // 7 days
export const VERIFICATION_TOKEN_EXPIRES = 1 * 24 * 60 * 60; // 1 day
export const OTP_EXPIRES = 60 * 10; // 10 minutes

export const refreshTokenCookieOptions = {
	httpOnly: true,
	// secure: process.env.NODE_ENV === "production",
	secure: true,
	signed: true,
	maxAge: REFRESH_TOKEN_EXPIRES * 1000,
};

export const accessTokenCookieOptions = {
	// secure: process.env.NODE_ENV === "production",
	secure: true,
	signed: true,
	maxAge: 15 * 60 * 1000, // Cookie will expire in 15 minutes
};

export const RESPONSE_TAGS = {
	auth: "Auth",
	verification: "Verification",
	country: "Country",
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
	logout: "/logout",
	refreshToken: "/refresh-token",
	passwordReset: "/password-reset",
	passwordResetLink: "/password-reset/:email",
	getUser: "/me",
	getAllUsers: "/all",
	updateUser: "/update",
	searchUser: "/search",
	verifyOtp: "/verify-otp",
};

export const PAGINATION = {
	PAGE: 1,
	LIMIT: 10,
};

export const EXCLUDE_FIELDS = {
	USER: "-_id -password",
};
