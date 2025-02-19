import { userReferralsTrackingJob } from "./ReferralQueue";

const runAllJobs = () => {
	userReferralsTrackingJob();
};

export default runAllJobs;
