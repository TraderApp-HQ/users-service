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

export const cookieOptions = {
	httpOnly: true,
	secure: true,
	signed: true,
	maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie will expire in 7 days
	};