import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";
import { AuthRoutes, CountryRoutes, VerificationRoutes, UserRoutes, TaskRoutes } from "./routes";
import { config } from "dotenv";
import { apiResponseHandler, logger, initSecrets } from "@traderapp/shared-resources";

import { ResponseType, ENVIRONMENTS, RESPONSE_FLAGS } from "./config/constants";
import cookieParser from "cookie-parser";

import swaggerUi from "swagger-ui-express";
import specs from "./utils/swagger";

import secretsJson from "./env.json";
import runAllJobs from "./jobs";

config();
const app = express();

const env = process.env.NODE_ENV;
if (!env) {
	logger.error("Error: Environment variable not set");
	process.exit(1);
}
const suffix = ENVIRONMENTS[env].slug;
const secretNames = ["common-secrets", "users-service-secrets"];

(async function () {
	await initSecrets({
		env: suffix,
		secretNames,
		secretsJson,
	});
	const port = process.env.PORT;
	const dbUrl = process.env.USERS_SERVICE_DB_URL ?? "";
	mongoose
		.connect(dbUrl)
		.then(() => {
			app.listen(port, () => {
				startServer();
				logger.log(`Server listening at port ${port}`);
				logger.log(`Docs available at http://localhost:${port}/api-docs`);
			});
		})
		.catch((err) => {
			logger.error(`Unable to connect to mongodb. Error === ${JSON.stringify(err)}`);
		});
})();

function startServer() {
	// cors
	// Define an array of allowed origins
	const allowedOrigins = [
		"http://localhost:3000",
		"http://localhost:8788",
		"http://localhost:8080",
		"https://users-dashboard-dev.traderapp.finance",
		"https://web-dashboard-dev.traderapp.finance",
		"https://www.web-dashboard-dev.traderapp.finance",
		"https://web-dashboard-staging.traderapp.finance",
		"https://www.web-dashboard-staging.traderapp.finance",
		"https://web-dashboard-hotfix.traderapp.finance",
		"https://www.web-dashboard-hotfix.traderapp.finance",
		"https://dashboard.traderapp.finance",
		"https://www.dashboard.traderapp.finance",
	];

	const corsOptions = {
		origin: (
			origin: string | undefined,
			callback: (error: Error | null, allow?: boolean) => void,
		) => {
			// Allow requests with no origin (like mobile apps or curl requests)
			if (!origin) return callback(null, true);
			if (allowedOrigins.includes(origin)) {
				return callback(null, true);
			} else {
				return callback(new Error(`Not allowed by CORS: ${origin}`));
			}
		},
		methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
		credentials: true, // Allow credentials
	};
	app.use(cors(corsOptions));

	// parse incoming requests
	app.use(express.urlencoded({ extended: true, limit: "8mb" }));
	app.use(express.json({ limit: "8mb" }));
	app.use(cookieParser(process.env.COOKIE_SECRET_KEY));

	// documentation
	app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

	// api routes
	app.use("/auth", AuthRoutes);
	app.use("/verify", VerificationRoutes);
	app.use("/countries", CountryRoutes);
	app.use("/users", UserRoutes);
	app.use("/task", TaskRoutes);

	// health check
	app.get("/ping", async (_req, res, _next) => {
		res.status(200).json(
			apiResponseHandler({
				message: `Pong!!! Users service is running on ${env} environment`,
			}),
		);
	});

	// handle errors
	app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
		let errorName = err.name;
		let errorMessage = err.message;
		let statusCode: number;

		if (err.name === RESPONSE_FLAGS.validationError) statusCode = 400;
		else if (err.name === RESPONSE_FLAGS.unauthorized) statusCode = 401;
		else if (err.name === RESPONSE_FLAGS.forbidden) statusCode = 403;
		else if (err.name === RESPONSE_FLAGS.notfound) statusCode = 404;
		else {
			statusCode = 500;
			errorName = "InternalServerError";
			errorMessage = "Something went wrong. Please try again after a while.";
			console.log("Error name: ", err.name, "Error message: ", err.message);
		}

		res.status(statusCode).json(
			apiResponseHandler({
				type: ResponseType.ERROR,
				message: errorMessage,
				object: {
					statusCode,
					errorName,
					errorMessage,
				},
			}),
		);
	});

	// Start all jobs when the application starts
	runAllJobs();
}
