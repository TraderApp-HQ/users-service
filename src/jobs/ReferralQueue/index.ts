import cron from "node-cron";
import { ReferralService } from "../../services/ReferralService";
import { EVERY_THREE_HOURS } from "../config";

export function userReferralsTrackingJob() {
	const referralService = new ReferralService();

	cron.schedule(EVERY_THREE_HOURS, async () => {
		try {
			await referralService.sendUserReferralProfilesToQueue();
			console.log("Successfully sent referrals to queue");
		} catch (err) {
			console.log("Error sending referrals to queue", err);
		}
	});
}
