import {
	CloudWatchLogsClient,
	DescribeLogStreamsCommand,
	CreateLogStreamCommand,
} from "@aws-sdk/client-cloudwatch-logs";
import { Logger, LoggerConfig } from "aws-cloudwatch-log";
import { format } from "date-fns";

// Function to generate a random log stream name
function generateRandomLogStreamName(): string {
	return `cloudfare-log-testing-${Math.random().toString(36).substring(2, 15)}`;
}

// Function to ensure the log stream exists, creating it if necessary
async function ensureLogStreamExists(
	cloudwatchlogsClient: CloudWatchLogsClient,
	logGroupName: string,
	logStreamName: string,
) {
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
async function initializeLogger(config: LoggerConfig): Promise<void> {
	const logStreamName = generateRandomLogStreamName();
	const cloudwatchlogsClient = new CloudWatchLogsClient({
		region: config.region,
		credentials: {
			accessKeyId: config.accessKeyId,
			secretAccessKey: config.secretAccessKey,
		},
	});
	await ensureLogStreamExists(cloudwatchlogsClient, config.logGroupName, logStreamName);
	const dynamicConfig = { ...config, logStreamName };
	logger = new Logger(dynamicConfig);
	console.log(`Logger initialized with log stream: ${logStreamName}`);
}

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

// Private function to log a message with a specified level
async function log(level: string, message: string, ...response: any[]) {
	await waitForLogger();

	if (logger) {
		const timestamp = format(new Date(), "yyyy-MM-dd HH:mm:ss");
		const logMessage = {
			timestamp,
			node_env: process.env.NODE_ENV,
			service_name: process.env.SERVICE,
			level,
			message,
			...response.reduce((acc, curr, index) => {
				acc[`data${index + 1}`] = curr;
				return acc;
			}, {}),
		};
		logger.log(logMessage);
	} else {
		console.error("Logger is not initialized.");
	}
}

// Log level methods
const loggers = {
	async info(message: string, ...response: any[]) {
		await log("info", message, ...response);
	},

	async warn(message: string, ...response: any[]) {
		await log("warn", message, ...response);
	},

	async error(message: string, ...response: any[]) {
		await log("error", message, ...response);
	},

	async debug(message: string, ...response: any[]) {
		await log("debug", message, ...response);
	},

	async log(message: string, ...response: any[]) {
		await log("log", message, ...response);
	},
};

export { initializeLogger, loggers };
