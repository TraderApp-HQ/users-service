import cron from "node-cron";
import { ReferralService } from "../services/ReferralService";

cron.schedule("0 0 * * *", async () => {
	try {
		const referralService = new ReferralService();
		await referralService.sendUserReferralIdsToQueue();

		console.log("Successfully sent referral IDs to queue");
	} catch (err) {
		console.error("Error sending referral IDs to queu");
	}
});
