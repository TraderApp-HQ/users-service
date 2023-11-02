import apiResponse from "@/utils/response-handler";
import { Request, Response, NextFunction, json } from "express";

export async function sendEmailVerificationCodeHandler(req: Request, res: Response, next: NextFunction) {
    res.status(200).json(apiResponse({
        message: "Send email verification code handler working!"
    }))
}

export async function sendPhoneVerificationCodeHandler(req: Request, res: Response, next: NextFunction) {
    res.status(200).json(apiResponse({
        message: "Send phone verification code handler working!"
    }))
}

export async function confirmEmailVerificationCodeHandler(req: Request, res: Response, next: NextFunction) {
    res.status(200).json(apiResponse({
        message: "Confirm email verification code handler working!"
    }))
}

export async function confirmPhoneVerificationCodeHandler(req: Request, res: Response, next: NextFunction) {
    res.status(200).json(apiResponse({
        message: "Confirm phone verification code handler working!"
    }))
}