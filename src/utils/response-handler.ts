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
		data: input?.object ?? {},
		error: null,
		message: input?.message ?? "Request was successfull",
	};

	if (input?.type && input.type === "error") {
		response.error = input.object ?? {};
		response.message = input.message ?? "Request failed";
		response.data = null;
	}

	return response;
}
