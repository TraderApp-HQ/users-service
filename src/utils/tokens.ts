import JWT from "jsonwebtoken"; 
import dotenv from "dotenv";
import { Payload } from "../types";

dotenv.config();
const expires = 15;

export function generateAccessToken(payload: any) {
    return new Promise((resolve, reject) => {
        const secret = process.env.ACCESS_TOKEN_SECRET as string;
        const options = { expiresIn: `${expires}m`, issuer: "traderapp" };
        JWT.sign(payload, secret, options, (err, token) => {
            if(err) return reject(err);
            resolve(token);
        })
    });
}

export function generateRefreshToken(payload: any) {
    return new Promise((resolve, reject) => {
        const secret = process.env.REFRESH_TOKEN_SECRET as string;
        const options = { expiresIn: "30d", issuer: "traderapp" };

        JWT.sign(payload, secret, options, (err, token) => {
            if(err) return reject(err);
            resolve(token);
        })
    });
}

export function verifyRefreshToken(refreshToken: string) {
    return new Promise((resolve, reject) => {
        const secret = process.env.REFRESH_TOKEN_SECRET as string;

        JWT.verify(refreshToken, secret, (err, payload) => {
            if(err) {
                err.name = "Unauthorized";
                err.message = "Invalid Token";
                reject(err);
            }
            const { id } = payload as Payload;
            resolve(id);
        })
    })
}

export function issueTokenResponse(access_token: string, refresh_token: string) {
    return {
        access_token,
        refresh_token,
        token_type: "bearer",
        expires: expires * 60
    }
}

export async function generateResetToken() {
    const {
        randomBytes,
    } = await import('node:crypto');
    
    const buf = randomBytes(64);

    return buf.toString('hex');
}