import { DOC_RESPONSE, RESPONSE_CODES, RESPONSE_TAGS } from "../../config/constants";

const verifyAuthOtpBody = {
	type: "object",
	required: ["userId", "data", "verificationType"],
	properties: {
		userId: {
			type: "string",
			example: "",
			required: false,
		},
		data: {
			type: "array",
			required: true,
			items: {
				type: "object",
				properties: {
					otp: {
						type: "string",
						example: "123456",
						required: true,
					},
					channel: {
						type: "string",
						example: "EMAIL",
					},
				},
			},
		},
		verificationType: {
			type: "array",
			required: true,
			items: {
				type: "string",
				example: "AUTHENTICATE",
			},
		},
	},
};

const verifyAuthOtp = {
	tags: [RESPONSE_TAGS.auth],
	description: "Create a new user in the system",
	requestBody: {
		content: {
			"application/json": {
				schema: {
					$ref: "#/components/schemas/verifyAuthOtpBody",
				},
			},
		},
		required: true,
	},
	responses: {
		[RESPONSE_CODES.ok]: DOC_RESPONSE.SUCCESS,
		[RESPONSE_CODES.created]: DOC_RESPONSE.REGISTER_SUCCESS,
		[RESPONSE_CODES.badRequest]: DOC_RESPONSE.BADREQUEST,
		[RESPONSE_CODES.unauthorized]: DOC_RESPONSE.UNAUTHORIZED,
		[RESPONSE_CODES.serverError]: DOC_RESPONSE.SERVERERROR,
	},
};

export { verifyAuthOtp, verifyAuthOtpBody };
