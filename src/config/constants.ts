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
interface docResponseInterface {
	description: string,
	properties: object
}

const docResponseBody = (responseObj: docResponseInterface) => {
	return {
		description: responseObj.description,
		content: {
			'application/json': {
				schema: {
					type: 'object',
					properties: responseObj.properties
				},
			},
		},
	}
}
export const DOCRESPONSE = {
	SERVERERROR: docResponseBody({
		description: 'Internal Server Error',
		properties: {
			message: {
				type: 'string',
				example: 'Internal Server Error',
			},
		}
	}),
	UNAUTHORIZED: docResponseBody({
		description: 'Error: Unauthorized',
		properties: {
			message: {
				type: 'string',
				example: "Invalid Token",
			},
		}
	}),
	BADREQUEST: docResponseBody({
		description: 'Error: Bad Request',
		properties: {
			message: {
				type: 'string',
				example: "Bad Request",
			},
		}
	}),
	SUCCESS: docResponseBody({
		description: 'Success',
		properties: {
			message: {
				type: 'string',
				example: "Request was successful",
			},
		}
	}),
	LOGOUTSUCCESS: docResponseBody({
		description: 'User Logged out successfully!',
		properties: {
			data: {
				type: 'object',
				example: {},
			},
			error: {
				type: 'string',
				example: null,
			},
			message: {
				type: 'string',
				example: 'Response is successful',
			},
		}
	}),
	LOGINSUCCESS: docResponseBody({
		description: 'User Logged in successfully!',
		properties: {
			data: {
				type: 'object',
				example: {},
			},
			error: {
				type: 'string',
				example: null,
			},
			message: {
				type: 'string',
				example: 'Response is successful',
			},
		}
	}),
	PASSWORDRESETLINKSUCCESS: docResponseBody({
		description: 'Password Resetted in successfully!',
		properties: {
			data: {
				type: 'object',
				example: {},
			},
			error: {
				type: 'string',
				example: null,
			},
			message: {
				type: 'string',
				example: 'Response is successful',
			},
		}
	}),
	REFRESHTOKENSUCCESS: docResponseBody({
		description: 'Refresh Token requested successfully!',
		properties: {
			data: {
				type: 'object',
				example: {},
			},
			error: {
				type: 'string',
				example: null,
			},
			message: {
				type: 'string',
				example: 'Response is successful',
			},
		}
	}),
	REGISTERSUCCESS: docResponseBody({
		description: 'User created successfully!',
		properties: {
			data: {
				type: 'object',
				example: {},
			},
			error: {
				type: 'string',
				example: null,
			},
			message: {
				type: 'string',
				example: 'Response is successful',
			},
		}
	}),
}