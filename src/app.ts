import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";
import { AuthRoutes, CountryRoutes, VerificationRoutes } from "./routes";
import { config } from "dotenv";
import initSecrets from "./config/initialize-secrets";
import logger from "./logger/logger";

import apiResponse from "./utils/response-handler";
import { ResponseType } from "./config/constants";
import cookies from "cookie-parser";

import swaggerUi from "swagger-ui-express"
import specs from "./utils/swagger";

config();
const app = express();
(async function() {
    await initSecrets();
    const port = process.env.PORT;
    const dbUrl = process.env.USERS_SERVICE_DB_URL || ''
    // connect to mongodb
    mongoose.connect(dbUrl).then(() => {
        app.listen(port, () => {
            logger.log(`Server listening at port ${port}`);
            startServer();
            logger.log(`Docs available at localhost:${port}/api-docs`);
        })
    })
    .catch((err) => {
        logger.error("Unable to connect to mongodb")
    });
})();

function startServer() {
    // cors
    app.use(
        cors({  
          origin: "*",
          methods: "GET, HEAD, PUT, PATCH, POST, DELETE"
        })
    );
    
    // parse incoming requests
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(cookies(process.env.COOKIE_SECRET_KEY))

    //documentation
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
    
    // api routes
    app.use("/auth", AuthRoutes);
    app.use("/verify", VerificationRoutes);
    app.use("/countries", CountryRoutes);

    // health check
    app.get("/ping", async (req, res, next) => {
        res.status(200).send({ message: "pong" });
    });

    // handle errors
    app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
        const status = "ERROR";
        let error_name = err.name;
        let error_message = err.message;
        let statusCode;

        if(err.name === "ValidationError") statusCode = 400;
        else if(err.name === "Unauthorized") statusCode = 401;
        else if(err.name === "Forbidden") statusCode = 403;
        else if(err.name === "NotFound") statusCode = 404;
        else {
            statusCode = 500;
            error_name = "InternalServerError";
            error_message = "Something went wrong. Please try again after a while.";
            console.log("Error name: ", err.name, "Error message: ", err.message);
        }

        res.status(statusCode).json(apiResponse({
            type: ResponseType.ERROR,
            message: error_message
        }))
    });
}