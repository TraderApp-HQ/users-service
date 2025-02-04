import cron from "node-cron";
import { ReferralService } from "../../services/ReferralService";
import { EVERY_MIDNIGHT } from "../config";

export function referralIdsQueueJob() {
	const referralService = new ReferralService();

	cron.schedule(EVERY_MIDNIGHT, async () => {
		try {
			await referralService.sendUserReferralIdsToQueue();
			console.log("Successfully sent referral IDs to queue");
		} catch (err) {
			console.error("Error sending referral IDs to queue");
		}
	});
}
