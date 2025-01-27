import { DOC_RESPONSE, RESPONSE_CODES, RESPONSE_TAGS } from "../../config/constants";

const createAuthCreateUserBody = {
	type: "object",
	required: ["firstName", "lastName", "role", "email", "countryId"],
	properties: {
		firstName: {
			type: "string",
			example: "Test",
		},
		lastName: {
			type: "string",
			example: "123",
		},
		email: {
			type: "string",
			example: "Test123@gmail.com",
		},
		role: {
			type: "array",
			example: ["USER"],
		},
		countryId: {
			type: "number",
			example: 89,
		},
		countryName: {
			type: "string",
			example: "Nigeria",
		},
	},
};

const createAuthCreateUser = {
	tags: [RESPONSE_TAGS.auth],
	description: "Create a new user in the system by an authorised admin",
	requestBody: {
		content: {
			"application/json": {
				schema: {
					$ref: "#/components/schemas/createAuthCreateUserBody",
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

export { createAuthCreateUser, createAuthCreateUserBody };
