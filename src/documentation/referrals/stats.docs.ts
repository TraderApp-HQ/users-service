import { RESPONSE_TAGS, RESPONSE_CODES, DOC_RESPONSE } from "../../config/constants";

const getReferralsStats = {
	tags: [RESPONSE_TAGS.referrals],
	description:
		"Get referrals status (overview: referralCode, referralProgress, currentRank, referralEarnings)",
	responses: {
		[RESPONSE_CODES.ok]: DOC_RESPONSE.SUCCESS,
		[RESPONSE_CODES.badRequest]: DOC_RESPONSE.BADREQUEST,
		[RESPONSE_CODES.unauthorized]: DOC_RESPONSE.UNAUTHORIZED,
		[RESPONSE_CODES.serverError]: DOC_RESPONSE.SERVERERROR,
	},
};

export { getReferralsStats };
