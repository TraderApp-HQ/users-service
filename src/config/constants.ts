import { apiDocumentationResponseObject } from "@traderapp/shared-resources";

export const ENVIRONMENTS: Record<string, string> = Object.freeze({
	development: "dev",
	staging: "staging",
	production: "prod",
});

export const TOKEN_ATTRIBUTES = {
	ACCESS_TOKEN_EXPIRES: "15m",
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
	SIGNUP: "Signup was successful",
	PASSWORD_RESET_SENT: "Password rest link has been sent",
	PASSWORD_RESET: "Password was reset successfully!",
	GET_USERS: "Users Fetched successfully",
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

export const cookieOptions = {
	httpOnly: true,
	secure: true,
	signed: true,
	maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie will expire in 7 days
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
	refresh_token: "/refresh-token",
	password_reset: "/password-reset",
	password_reset_link: "/password-reset/:email",
	get_user: "/:id",
	get_all_users: "/",
	update_user: "/:id",
};

export const PAGINATION = {
	PAGE: 1,
	LIMIT: 10,
};

export const ROLES = {
	SUPER_ADMIN: "SUPER_ADMIN",
};
