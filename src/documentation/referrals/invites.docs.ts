import { RESPONSE_TAGS, RESPONSE_CODES, DOC_RESPONSE } from "../../config/constants";

const inviteFriendsBody = {
	type: "object",
	required: ["test"],
	properties: {
		test: {
			type: "string",
			example: "",
		},
	},
};

const inviteFriends = {
	tags: [RESPONSE_TAGS.referrals],
	description: "Send out invites to friends with user referral code",
	requestBody: {
		content: {
			"application/json": {
				schema: {
					$ref: "#/components/schemas/inviteFriendsBody",
				},
			},
		},
		required: true,
	},
	responses: {
		[RESPONSE_CODES.ok]: DOC_RESPONSE.SUCCESS,
		[RESPONSE_CODES.badRequest]: DOC_RESPONSE.BADREQUEST,
		[RESPONSE_CODES.unauthorized]: DOC_RESPONSE.UNAUTHORIZED,
		[RESPONSE_CODES.serverError]: DOC_RESPONSE.SERVERERROR,
	},
};

const communityStats = {
	tags: [RESPONSE_TAGS.referrals],
	description: "Get stats of user's community",
	responses: {
		[RESPONSE_CODES.ok]: DOC_RESPONSE.SUCCESS,
		[RESPONSE_CODES.badRequest]: DOC_RESPONSE.BADREQUEST,
		[RESPONSE_CODES.unauthorized]: DOC_RESPONSE.UNAUTHORIZED,
		[RESPONSE_CODES.serverError]: DOC_RESPONSE.SERVERERROR,
	},
};
const getReferrals = {
	tags: [RESPONSE_TAGS.referrals],
	description: "Get user's referrals",
	responses: {
		[RESPONSE_CODES.ok]: DOC_RESPONSE.SUCCESS,
		[RESPONSE_CODES.badRequest]: DOC_RESPONSE.BADREQUEST,
		[RESPONSE_CODES.unauthorized]: DOC_RESPONSE.UNAUTHORIZED,
		[RESPONSE_CODES.serverError]: DOC_RESPONSE.SERVERERROR,
	},
};

export { inviteFriends, inviteFriendsBody, communityStats, getReferrals };
