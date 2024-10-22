export enum Role {
	USER = "USER",
	SUBSCRIBER = "SUBSCRIBER",
	ADMIN = "ADMIN",
	SUPER_ADMIN = "SUPER_ADMIN",
}

export enum ReferralRank {
	TA_RECRUIT = "TA-Recruit",
	TA_LIEUTENANT = "TA-Lieutenant",
	TA_CAPTAIN = "TA-Captain",
}

export enum NotificationChannel {
	EMAIL = "EMAIL",
	SMS = "SMS",
	WHATSAPP = "WHATSAPP",
}

export enum Status {
	ACTIVE = "ACTIVE",
	INACTIVE = "INACTIVE",
}

export enum Platform {
	INSTAGRAM = "Instagram",
	TWITTER = "Twitter",
	TIKTOK = "Tiktok",
	FACEBOOK = "Facebook",
	WHATSAPP = "Whatsapp",
	YOUTUBE = "Youtube",
	OTHERS = "Others",
}

export enum PlatformActions {
	LIKE = "Like",
	FOLLOW = "Follow",
	COMMENT = "Comment",
	SHARE = "Share",
	POST = "Post",
}

export enum TaskCategory {
	SOCIAL = "Social Media Engagement",
	CONTENT = "Content Creation",
	MARKET = "Market Research",
	REFERRAL = "Referral Tasks",
}

export enum TaskType {
	PERMANENT = "Permanent",
	TIME_BASED = "Time Based",
}

export enum TaskStatus {
	NOT_STARTED = "Not Started",
	STARTED = "Started",
	COMPLETED = "Completed",
}

export enum UserTaskStatus {
	PENDING = "Pending",
	IN_REVIEW = "In Review",
	DONE = "Done",
}
