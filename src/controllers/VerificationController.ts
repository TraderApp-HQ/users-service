import { Request, Response, NextFunction } from "express";

export async function sendEmailVerificationCodeHandler(req: Request, res: Response, next: NextFunction) {
    res.json("Send email verification code handler working!")
}

export async function sendPhoneVerificationCodeHandler(req: Request, res: Response, next: NextFunction) {
    res.json("Send phone verification code handler working!")
}

export async function confirmEmailVerificationCodeHandler(req: Request, res: Response, next: NextFunction) {
    res.json("Confirm email verification code handler working!")
}

export async function confirmPhoneVerificationCodeHandler(req: Request, res: Response, next: NextFunction) {
    res.json("Confirm phone verification code handler working!")
}