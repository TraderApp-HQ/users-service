import { DOC_RESPONSE, RESPONSE_CODES, RESPONSE_TAGS } from "../../config/constants";

const deactivateUserBody = {
	type: "object",
	required: ["userId"],
	properties: {
		userId: {
			type: "string",
		},
	},
};

const deactivateUser = {
	tags: [RESPONSE_TAGS.users],
	description: "Deactivate/Activate User by an authorised admin",
	requestBody: {
		content: {
			"application/json": {
				schema: {
					$ref: "#/components/schemas/deactivateUserBody",
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

export { deactivateUser, deactivateUserBody };
