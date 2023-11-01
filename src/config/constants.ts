export const ENVIRONMENTS: Record<string, string> = Object.freeze({
	DEVELOPMENT: "DEV",
	STAGING: "STAGING",
	PRODUCTION: "PROD",
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
  LOGIN: 'Login was successful'
}

interface APIResponseInput {
	type?: string;
	object?: object | null;
	message?: string;
}

interface APIReponse {
	data: object | null;
	error: object | null;
	message: string;
}

export default function apiResponse(input?: APIResponseInput) {
	const response: APIReponse = {
		data: input?.object || {},
		error: null,
		message: input?.message || "Request was successfull",
	};

	if (input?.type && input.type === "error") {
		response.error = input.object || {};
		response.message = input.message || "Request failed";
		response.data = null;
	}

	return response;
}
