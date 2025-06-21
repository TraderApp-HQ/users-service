import { Message } from "@aws-sdk/client-sqs";
import { SQSRecord } from "aws-lambda";
import { ChannelType, EventTemplate } from "./config";

export interface IMessageObject {
	recipientName: string;
	lastName?: string;
	phoneNumber?: string;
	emailAddress?: string;
	countryPhoneCode?: string;
	messageBody: string;
	messageHeader?: string;
}

export interface IQueueMessage {
	channel: ChannelType[];
	messageObject: IMessageObject;
	event: EventTemplate;
	client?: string;
}
export interface QueueMessage extends Omit<Message, "Body"> {
	Body: IQueueMessage;
}

export interface IMessageRecipient {
	firstName: string;
	lastName?: string;
	phoneNumber?: string;
	emailAddress?: string;
	countryPhoneCode?: string;
}

export interface IQueueMessageBodyObject {
	recipients: IMessageRecipient[];
	subject?: string;
	message: string;
	event: EventTemplate;
	sender?: IMessageRecipient;
}

export interface IQueueMessageBody extends Omit<SQSRecord, "body"> {
	body: IQueueMessageBodyObject;
}

export enum UserOnboardingTaskField {
	IS_EMAIL_VERIFIED = "isEmailVerified",
	IS_FIRST_DEPOSIT_MADE = "isFirstDepositMade",
	IS_TRADING_ACCOUNT_CONNECTED = "isTradingAccountConnected",
	IS_SOCIAL_ACCOUNT_CONNECTED = "isSocialAccountConnected",
	IS_ONBOARDING_TASK_DONE = "isOnboardingTaskDone",
	SHOW_ONBOARDING_STEPS = "showOnboardingSteps",
	IS_PHONE_VERIFIED = "isPhoneVerified",
	IS_ID_VERIFIED = "isIdVerified",
}
