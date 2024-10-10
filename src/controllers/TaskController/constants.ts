import { Platform, PlatformActions, TaskCategory } from "../../config/enums";
import { ITaskPlatform } from "../../config/interfaces";

export const TaskPlatforms: ITaskPlatform[] = [
	{
		name: Platform.INSTAGRAM,
		logoUrl: "https://aws-s3-dev-users-service.s3.eu-west-1.amazonaws.com/instagram.jpeg",
		isActive: true,
		supportedActions: [
			PlatformActions.LIKE,
			PlatformActions.FOLLOW,
			PlatformActions.COMMENT,
			PlatformActions.SHARE,
		],
		categories: [TaskCategory.SOCIAL, TaskCategory.CONTENT],
	},
	{
		name: Platform.TWITTER,
		logoUrl: "https://aws-s3-dev-users-service.s3.eu-west-1.amazonaws.com/twitter.png",
		isActive: true,
		supportedActions: [
			PlatformActions.LIKE,
			PlatformActions.FOLLOW,
			PlatformActions.COMMENT,
			PlatformActions.SHARE,
		],
		categories: [TaskCategory.SOCIAL, TaskCategory.CONTENT],
	},
	{
		name: Platform.TIKTOK,
		logoUrl: "https://aws-s3-dev-users-service.s3.eu-west-1.amazonaws.com/tiktok.png",
		isActive: false,
		supportedActions: [
			PlatformActions.LIKE,
			PlatformActions.FOLLOW,
			PlatformActions.COMMENT,
			PlatformActions.SHARE,
		],
		categories: [TaskCategory.SOCIAL, TaskCategory.CONTENT],
	},
	{
		name: Platform.FACEBOOK,
		logoUrl: "https://aws-s3-dev-users-service.s3.eu-west-1.amazonaws.com/facebook.png",
		isActive: true,
		supportedActions: [
			PlatformActions.LIKE,
			PlatformActions.FOLLOW,
			PlatformActions.COMMENT,
			PlatformActions.SHARE,
		],
		categories: [TaskCategory.SOCIAL, TaskCategory.CONTENT],
	},
	{
		name: Platform.WHATSAPP,
		logoUrl: "https://aws-s3-dev-users-service.s3.eu-west-1.amazonaws.com/whatsapp.jpeg",
		isActive: true,
		supportedActions: [PlatformActions.SHARE],
		categories: [TaskCategory.SOCIAL, TaskCategory.CONTENT],
	},
	{
		name: Platform.YOUTUBE,
		logoUrl: "https://aws-s3-dev-users-service.s3.eu-west-1.amazonaws.com/youtube.jpeg",
		isActive: false,
		supportedActions: [
			PlatformActions.LIKE,
			PlatformActions.FOLLOW,
			PlatformActions.COMMENT,
			PlatformActions.SHARE,
		],
		categories: [TaskCategory.SOCIAL, TaskCategory.CONTENT],
	},
	{
		name: Platform.OTHERS,
		logoUrl: "",
		isActive: true,
		supportedActions: [],
		categories: [TaskCategory.CONTENT, TaskCategory.MARKET, TaskCategory.REFERRAL],
	},
];
