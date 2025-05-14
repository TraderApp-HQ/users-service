import { DOC_RESPONSE, RESPONSE_CODES, RESPONSE_TAGS } from "../../config/constants";

const userUpdateBody = {
	type: "object",
	required: ["userId"],
	properties: {
		userId: {
			type: "string",
		},
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

const userUpdate = {
	tags: [RESPONSE_TAGS.users],
	description: "Update User details by an authorised admin",
	requestBody: {
		content: {
			"application/json": {
				schema: {
					$ref: "#/components/schemas/userUpdateBody",
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

export { userUpdate, userUpdateBody };
