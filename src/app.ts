import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";
import { AuthRoutes, CountryRoutes, VerificationRoutes, UserRoutes } from "./routes";
import { config } from "dotenv";
import { apiResponseHandler, logger, initSecrets } from "@traderapp/shared-resources";

import { ResponseType, ENVIRONMENTS } from "./config/constants";
import cookies from "cookie-parser";

import swaggerUi from "swagger-ui-express";
import specs from "./utils/swagger";

import secretsJson from "./env.json";

config();
const app = express();
let server = null;

const env = process.env.NODE_ENV ?? "development";
const suffix = ENVIRONMENTS[env];
const secretNames = ["common-secrets", "users-service-secrets"];

(async function () {
	await initSecrets({
		env: suffix,
		secretNames,
		secretsJson,
	});
	const port = process.env.PORT;
	const dbUrl = process.env.USERS_SERVICE_DB_URL ?? "";
	// connect to mongodb
	mongoose
		.connect(dbUrl)
		.then(() => {
			server = app.listen(port, () => {
				logger.log(`Server listening at port ${port}`);
				startServer();
				logger.log(`Docs available at http://localhost:${port}/api-docs`);
			});
		})
		.catch((err) => {
			logger.error(`Unable to connect to mongodb. Error === ${JSON.stringify(err)}`);
		});
})();

function startServer() {
	// cors
	app.use(
		cors({
			origin: "*",
			methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
		}),
	);

	// parse incoming requests
	app.use(express.urlencoded({ extended: true }));
	app.use(express.json());
	app.use(cookies(process.env.COOKIE_SECRET_KEY));

	// documentation
	app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

	// api routes
	app.use("/auth", AuthRoutes);
	app.use("/verify", VerificationRoutes);
	app.use("/countries", CountryRoutes);
	app.use("/users", UserRoutes);

	// health check
	app.get("/ping", async (req, res, next) => {
		res.status(200).send({ message: "pong" });
	});

	// handle errors
	app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
		let errorName = err.name;
		let errorMessage = err.message;
		let statusCode;

		if (err.name === "ValidationError") statusCode = 400;
		else if (err.name === "Unauthorized") statusCode = 401;
		else if (err.name === "Forbidden") statusCode = 403;
		else if (err.name === "NotFound") statusCode = 404;
		else {
			statusCode = 500;
			errorName = "InternalServerError";
			errorMessage = "Something went wrong. Please try again after a while.";
			console.log("Error name: ", errorName, "Error message: ", err.message);
		}

		res.status(statusCode).json(
			apiResponseHandler({
				type: ResponseType.ERROR,
				message: errorMessage,
			}),
		);
	});
}

module.exports = server;
