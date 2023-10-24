import { Router } from "express";
import {countriesHandler, countryHandler } from "@/controllers/CountryController";
import { validateGetCountryRequest } from "@/middlewares/CountryMiddleware";

const router = Router();

router.get("/", countriesHandler);
router.get("/:id", validateGetCountryRequest, countryHandler);

export default router;