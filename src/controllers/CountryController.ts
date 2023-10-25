import { Request, Response, NextFunction } from "express";
import Country from "@/models/Country";

const status = "SUCCESS";

export async function countriesHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const data = await Country.find({});
        res.status(200).json({ status, data })
    }
    catch(err: any) {
        err.message = "Something went wrong fetching countries";
        next(err);
    }
}

export async function countryHandler(req: Request, res: Response, next: NextFunction) {
    let { id } = req.params;

    try {
        const data = await Country.findOne({ _id: id });
        res.status(200).json({ status, data });
    }
    catch(err: any) {
        err.message = "Something went wrong fetching country!";
        next(err);
    }
}