import { DOC_RESPONSE, RESPONSE_CODES, RESPONSE_TAGS } from "../../config/constants";

const deactivateUserPath = {
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
	parameters: [
		{
			in: "path",
			name: "userId",
			schema: {
				type: "string",
			},
			required: true,
			description: "User ID to deactivate/activate",
		},
	],
	responses: {
		[RESPONSE_CODES.ok]: DOC_RESPONSE.SUCCESS,
		[RESPONSE_CODES.created]: DOC_RESPONSE.REGISTER_SUCCESS,
		[RESPONSE_CODES.badRequest]: DOC_RESPONSE.BADREQUEST,
		[RESPONSE_CODES.unauthorized]: DOC_RESPONSE.UNAUTHORIZED,
		[RESPONSE_CODES.serverError]: DOC_RESPONSE.SERVERERROR,
	},
};

export { deactivateUser, deactivateUserPath };
