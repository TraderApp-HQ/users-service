import { DOC_RESPONSE, RESPONSE_CODES, RESPONSE_TAGS } from "../../config/constants";

const createAuthSignupBody = {
	type: "object",
	required: ["first_name", "last_name", "email", "password", "dob", "country_id"],
	properties: {
		firstName: {
			type: "string",
			example: "Test",
			required: false,
		},
		lastName: {
			type: "string",
			example: "123",
			required: true,
		},
		email: {
			type: "string",
			example: "Test123@gmail.com",
		},
		password: {
			type: "string",
			example: "Test12345@",
		},
		countryId: {
			type: "number",
			example: 234,
		},
		countryName: {
			type: "string",
			example: "Nigeria",
		},
		referralCode: {
			type: "string",
			example: "JD_LK324",
		},
	},
};

const createAuthSignup = {
	tags: [RESPONSE_TAGS.auth],
	description: "Create a new user in the system",
	requestBody: {
		content: {
			"application/json": {
				schema: {
					$ref: "#/components/schemas/createAuthSignupBody",
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

export { createAuthSignup, createAuthSignupBody };
