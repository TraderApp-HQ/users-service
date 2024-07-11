declare module "aws-cloudwatch-log" {
	interface LoggerConfig {
		logGroupName: string;
		logStreamName: string;
		region: string;
		accessKeyId: string;
		secretAccessKey: string;
		uploadFreq?: number;
		local?: boolean;
	}

	export class Logger {
		constructor(config: LoggerConfig);

		log(...messages: any[]): void;
	}
}
