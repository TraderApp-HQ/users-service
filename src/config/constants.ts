import { generateResponseObject } from "~/utils/swagger-response";

export const ENVIRONMENTS: Record<string, string> = Object.freeze({
	development: "dev",
	staging: "staging",
	production: "prod",
});

export const TOKEN_ATTRIBUTES = {
	ACCESS_TOKEN_EXPIRES: "15m",
	REFRESH_TOKEN_EXPIRES: "30d",
	EXPIRES_TIMESTAMP: 15 * 60,
	TOKEN_ISSUER: "traderapp.finance"
}

export const ResponseType = {
  SUCCESS: 'success',
  ERROR: 'error'
}

export const ResponseMessage = {
  LOGIN: 'Login was successful',
	SIGNUP: 'Signup was successful',
	PASSWORD_RESET_SENT: 'Password rest link has been sent',
	PASSWORD_RESET: 'Password was reset successfully!',

}

export const RESPONSE_TAGS = { 
	auth: 'Auth', 
	verification: 'Verification', 
	country: 'Country'
}

export const RESPONSE_CODES = {
	ok: "200",
	created: "201",
	badrequest: "400",
	unauthorized: "401",
	servererror: '500'
}

export const DOC_RESPONSE = {
  SERVERERROR: generateResponseObject('Internal Server Error'),
  UNAUTHORIZED: generateResponseObject('Error: Unauthorized'),
  BADREQUEST: generateResponseObject('Error: Bad Request'),
  SUCCESS: generateResponseObject('Success'),
  LOGOUT_SUCCESS: generateResponseObject('User Logged out successfully!'),
  LOGIN_SUCCESS: generateResponseObject('User Logged in successfully!'),
  PASSWORD_RESET_LINK_SUCCESS: generateResponseObject('Password Resetted in successfully!'),
  REFRESH_TOKEN_SUCCESS: generateResponseObject('Refresh Token requested successfully!'),
  REGISTER_SUCCESS: generateResponseObject('User created successfully!'),
}

export const ROUTES = {
	login: '/login',
	signup: '/signup',
	logout: '/logout',
	refresh_token: '/refresh-token',
	password_reset: '/password-reset',
	password_reset_link: '/password-reset/:email'
}