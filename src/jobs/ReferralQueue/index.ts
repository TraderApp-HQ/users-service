import cron from "node-cron";
import { ReferralService } from "../../services/ReferralService";
import { EVERY_MIDNIGHT } from "../config";

export function referralIdsQueueJob() {
	const referralService = new ReferralService();

	cron.schedule(EVERY_MIDNIGHT, async () => {
		try {
			await referralService.sendUserReferralProfilesToQueue();
			console.log("Successfully sent referrals to queue");
		} catch (err) {
			console.log("Error sending referrals to queue", err);
		}
	});
}
