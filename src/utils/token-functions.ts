import JWT from "jsonwebtoken"; 
import dotenv from "dotenv";
import { Payload } from "../types";
import { TOKEN_ATTRIBUTES } from "../config/constants";

//init env variables
dotenv.config();

/* A function to generate access token.
** It generates and returns an access token and throws an error if something goes wrong
*/
export function generateAccessToken(payload: any) {
    return new Promise(async (resolve, reject) => {
        let secret = process.env.ACCESS_TOKEN_SECRET || '';
        
        //prepare and sign access token
        const options = { expiresIn: TOKEN_ATTRIBUTES.ACCESS_TOKEN_EXPIRES, issuer: TOKEN_ATTRIBUTES.TOKEN_ISSUER };
        JWT.sign(payload, secret, options, (err, token) => {
            if(err) {
                reject(err);
                return;
            }

            resolve(token);
        })
    });
}

/* A function to generate refresh token.
** It generates and returns a refresh token and throws an error if something goes wrong. 
*/
export function generateRefreshToken(payload: any) {
    return new Promise(async (resolve, reject) => {
        let secret = process.env.REFRESH_TOKEN_SECRET || '';

        //prepare and sign refresh token
        const options = { expiresIn: TOKEN_ATTRIBUTES.REFRESH_TOKEN_EXPIRES, issuer: TOKEN_ATTRIBUTES.TOKEN_ISSUER };
        JWT.sign(payload, secret, options, (err, token) => {
            if(err) {
                reject(err);
                return;
            }

            resolve(token);
        })
    });
}

// A function to verify refresh token
export function verifyRefreshToken(refreshToken: string) {
    return new Promise(async (resolve, reject) => {
        let secret = process.env.REFRESH_TOKEN_SECRET || '';

        JWT.verify(refreshToken, secret, (err, payload) => {
            //throw error if error
            if(err) {
                err.name = "Unauthorized";
                err.message = "Invalid Token";
                reject(err);
                return;
            }

            //return payload
            const { id } = payload as Payload;
            resolve(id);
        })
    })
}

// a function to format response for token issued
export function issueTokenResponse(access_token: string) {
    return {
        access_token,
        token_type: "bearer",
        expires: TOKEN_ATTRIBUTES.EXPIRES_TIMESTAMP
    }
}

// a function to generate password reset token
export async function generateResetToken() {
    const {
        randomBytes,
    } = await import('node:crypto');
    
    const buf = randomBytes(64);

    return buf.toString('hex');
}