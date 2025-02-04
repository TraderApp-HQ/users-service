import { referralIdsQueueJob } from "./ReferralQueue";

const runAllJobs = () => {
	referralIdsQueueJob();
};

export default runAllJobs;
