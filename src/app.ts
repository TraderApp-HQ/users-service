import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";
import { AuthRoutes, CountryRoutes, VerificationRoutes } from "@/routes";
import { config } from "dotenv";

import { getCountries, insertRoles } from "@/fixtures";

import initSecrets from "@/config/initialize-secrets";
import logger from "@/logger/logger";

config();

const app = express();

(async function() {
    // initialize secrets
    await initSecrets();
    const port = process.env.PORT || 8001;
    const dbUrl = process.env.USERS_SERVICE_DB_URL || ''
    //connect to mongodb
    mongoose.connect(dbUrl).then(() => {
        app.listen(port, () => {
            logger.log(`Server listening at port ${port}`);
            startServer();
        })
    })
    .catch((err) => {
        logger.error("Unable to connect to mongodb")
    });
})();

function startServer() {
    //cors
    app.use(
        cors({  
          origin: "*",
          methods: "GET, HEAD, PUT, PATCH, POST, DELETE"
        })
    );
    
    //parse incoming requests
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    //api routes
    app.use("/auth", AuthRoutes);
    app.use("/verify", VerificationRoutes);
    app.use("/countries", CountryRoutes);

    //route to populate db with countries and roles data
    app.post("/fixtures", async (req, res, next) => {
        try {
            //get all countries and fill db countries collection
            await getCountries();

            //populate roles collection
            await insertRoles();

            res.status(200).send({ message: "pong" });
        } catch (error) {
            logger.error(error)
            next(error);
        }
    })

    //health check
    app.get("/ping", async (req, res, next) => {
        res.status(200).send({ message: "pong" });
    });

    //handle errors
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

        res.status(statusCode).json({ status, error_name, error_message }); 
    });
}

