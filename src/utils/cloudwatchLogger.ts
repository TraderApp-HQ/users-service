import {
	CloudWatchLogsClient,
	DescribeLogStreamsCommand,
	CreateLogStreamCommand,
} from "@aws-sdk/client-cloudwatch-logs";
import { Logger } from "aws-cloudwatch-log";

// Configuration object for AWS CloudWatch Logs
const config = {
	logGroupName: "/aws/ec2/cloudfare-log-testing", // The name of the log group in AWS CloudWatch
	region: process.env.AWS_REGION ?? "", // AWS region, default to an empty string if not set
	accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "", // AWS access key ID, default to an empty string if not set
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "", // AWS secret access key, default to an empty string if not set
	uploadFreq: 10000, // Optional. Send logs to AWS LogStream in batches after 10 seconds intervals.
	local: false, // Optional. If set to true, the log will fall back to the standard 'console.log'.
};

// Initialize AWS CloudWatch Logs client with the provided configuration
const cloudwatchlogsClient = new CloudWatchLogsClient({
	region: config.region,
	credentials: {
		accessKeyId: config.accessKeyId,
		secretAccessKey: config.secretAccessKey,
	},
});

// Function to generate a random log stream name
function generateRandomLogStreamName(): string {
	return `cloudfare-log-testing-${Math.random().toString(36).substring(2, 15)}`;
}

// Function to ensure the log stream exists, creating it if necessary
async function ensureLogStreamExists(logStreamName: string) {
	const { logGroupName } = config;

	try {
		// Command to describe log streams with the specified log group and stream name prefix
		const describeLogStreamsCommand = new DescribeLogStreamsCommand({
			logGroupName,
			logStreamNamePrefix: logStreamName,
		});

		// Send the command to AWS CloudWatch Logs client
		const describeLogStreamsResponse =
			await cloudwatchlogsClient.send(describeLogStreamsCommand);

		// Check if the log stream already exists
		const logStreamExists = describeLogStreamsResponse.logStreams?.some(
			(logStream) => logStream.logStreamName === logStreamName,
		);

		if (logStreamExists) {
			console.log(`Log stream "${logStreamName}" already exists.`);
		} else {
			// Command to create a new log stream
			const createLogStreamCommand = new CreateLogStreamCommand({
				logGroupName,
				logStreamName,
			});

			// Send the command to AWS CloudWatch Logs client
			await cloudwatchlogsClient.send(createLogStreamCommand);

			console.log(`Log stream "${logStreamName}" created.`);
		}
	} catch (err: any) {
		console.error("Error describing or creating log stream:", err);
		throw err;
	}
}

// Logger instance
let logger: Logger;

// Function to initialize the logger
async function initializeLogger(): Promise<void> {
	const logStreamName = generateRandomLogStreamName();
	await ensureLogStreamExists(logStreamName);
	const dynamicConfig = { ...config, logStreamName };
	logger = new Logger(dynamicConfig); // Create a new Logger instance with the dynamic configuration
	console.log(`Logger initialized with log stream: ${logStreamName}`);
}

// Initialize the logger and handle potential errors
initializeLogger().catch((err) => {
	console.error("Failed to initialize logger:", err);
});

// Function to wait for the logger to be initialized
const waitForLogger = async () => {
	return new Promise<void>((resolve) => {
		const checkLogger = () => {
			if (logger) {
				resolve();
			} else {
				setTimeout(checkLogger, 100); // Check every 100ms
			}
		};
		checkLogger();
	});
};

// Function to log an object with a message and a response object
const loggers = async (message: string, ...response: any) => {
	await waitForLogger(); // Wait for the logger to be initialized
	if (logger) {
		const logMessage = {
			message,
			...response[0],
		};
		logger.log(logMessage);
	} else {
		console.error("Logger is not initialized.");
	}
};

export { loggers, waitForLogger };
