import "dotenv/config";
import { QueueService } from "..";
import { logger } from "@traderapp/shared-resources";
import { IQueueMessage, QueueMessage } from "../../types";

interface QueueInput {
	queueUrl: string;
	message: string | object | IQueueMessage;
	awsRegion?: string;
}

interface DeleteQueueMessagesInput {
	messages: QueueMessage[];
	queueUrl: string;
	awsRegion?: string;
}

export const readMessagesFromQueue = async ({
	queueUrl,
	awsRegion,
}: Omit<QueueInput, "message">) => {
	const region = awsRegion ?? process.env.AWS_REGION ?? "";
	const sqsClient = new QueueService({ region, queueUrl });

	try {
		const messages = await sqsClient.receiveMessages({
			maxNumberOfMessages: 10,
		});

		// format messages in the queue and send them to other places for processing
		const processedMessages: QueueMessage[] = [];
		messages.forEach((message) => {
			processedMessages.push({
				...message,
				Body: JSON.parse(message.Body as string) as IQueueMessage,
			});
		});
		return processedMessages;
	} catch (error) {
		logger.error(`Error reading messages from queue == ${JSON.stringify(error)}`);
		return [];
	}
};

export const publishMessageToQueue = async ({ message, queueUrl, awsRegion }: QueueInput) => {
	const region = awsRegion ?? process.env.AWS_REGION ?? "";
	const sqsClient = new QueueService({ region, queueUrl });

	try {
		let processedBody: string;
		if (typeof message === "string") {
			processedBody = message;
		} else {
			processedBody = JSON.stringify({
				...message,
				client: process.env.CLIENT ?? process.env.NODE_ENV ?? "",
			});
		}
		await sqsClient.sendMessage(processedBody);
	} catch (error) {
		logger.error(`Error sending message to queue == ${JSON.stringify(error)}`);
	}
};

export const deleteMessagesFromQueue = async ({
	queueUrl,
	awsRegion,
	messages,
}: DeleteQueueMessagesInput) => {
	const region = awsRegion ?? process.env.AWS_REGION ?? "";
	const sqsClient = new QueueService({ region, queueUrl });

	try {
		await sqsClient.deleteMessages(messages);
	} catch (error) {
		logger.error(`Error Deleting messages from queue == ${JSON.stringify(error)}`);
	}
};
