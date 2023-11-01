import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import User from "@/models/User";
import Token from "@/models/RefreshToken";
import PasswordResetToken from "@/models/PasswordResetToken";
import { 
    generateAccessToken, 
    generateRefreshToken, 
    issueTokenResponse, 
    generateResetToken 
} from "@/utils/token-functions";
import apiResponse from "@/config/constants";
import { ResponseMessage } from "@/config/constants";

async function buildResponse(data: any) {
    const user = {
        id: data._id,
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
        email: data.email,
        dob: data.dob,
        isPhoneVerified: data.isPhoneVerified,
        isEmailVerified: data.isEmailVerified,
        isIdVerified: data.isIdVerified,
        role: data.role
    }

    //generate access and refreh tokens
    const access_token = await generateAccessToken(user) as string;
    const refresh_token = await generateRefreshToken({ id: user.id }) as string;

    //set time for refreshToken expiry
    let expireAt = new Date();
    expireAt.setSeconds(expireAt.getSeconds() + (60 * 2));
    expireAt.toISOString();

    //check if user already has refresh_token in db
    const isUserToken = await Token.findOne({ _id: user.id });

    //update refresh_token if true, else insert one
    if(isUserToken) {
        await Token.updateOne({ _id: user.id }, { $set: { refresh_token, expireAt } });
    }
    else {
        await Token.create({ _id: user.id, refresh_token, expireAt });
    }

    //format json response
    const res = issueTokenResponse(access_token, refresh_token);

    return res;
}

export async function signupHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const data = await User.create(req.body);
        const tokenRes = await buildResponse(data);
        res.status(200).json(tokenRes);
    }
    catch(err) {
        next(err);
    }
}

export async function loginHandler(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    try {
        const data = await User.login(email, password);

        if(!data) {
            const error = new Error("Invalid login credentials!")
            error.name = "NotFound"
            throw error;
        }
9
        const tokenRes =  await buildResponse(data);
        res.status(200).json(apiResponse({
            object: tokenRes,
            message: ResponseMessage.LOGIN
        }))

    }
    catch(err: any) {
        next(err);
    }
}

export async function logoutHandler(req: Request, res: Response, next: NextFunction) {
    const { _id } = req.body;

    try {
        await Token.deleteOne({ _id });
        res.status(204).json({});
    }
    catch(err) {
        next(err);
    }
}

export async function refreshTokenHandler(req: Request, res: Response, next: NextFunction) {
    const { _id } = req.body;

    try {
        const data = await User.findOne({ _id });
        const tokenRes = await buildResponse(data);
        res.status(200).json(tokenRes);
    }
    catch(err) {
        next(err);
    }
}

export async function sendPasswordResetLinkHandler(req: Request, res: Response, next: NextFunction) {
    const { _id } = req.body;

    try {
        if(_id) {
            //check if user already has a reset_token and delete it
            const isToken = await PasswordResetToken.findOne({ _id });
            if(isToken) await PasswordResetToken.deleteOne({ _id });

            let reset_token = await generateResetToken();
        
            //hash reset_token
            let salt = await bcrypt.genSalt(10);
            let hashed = await bcrypt.hash(reset_token, salt);

            //insert reset_token in db
            await PasswordResetToken.create({ _id, reset_token: hashed });

            //send email
            const url = `https://traderapp.finance/account/password-reset?token=${reset_token}&id=${_id}`;
            console.log("password reset token is: ", reset_token);
            console.log("stored hashed is : ", hashed);
        }

        res.status(200).json("Password rest link has been sent");
    }
    catch(err) {
        next(err);
    }
}

export async function passwordResetHandler(req: Request, res: Response, next: NextFunction) {
    const { user_id, password } = req.body;

    try {
        //hash password
        let salt = await bcrypt.genSalt(10);
        let hashed = await bcrypt.hash(password, salt);

        //update password
        await User.updateOne({ _id: user_id }, { $set: { password: hashed } });

        //delete reset token
        await PasswordResetToken.deleteOne({ _id: user_id });

        //delete refresh token
        const hasRefreshToken = await Token.findOne({ _id: user_id });
        if(hasRefreshToken) await Token.deleteOne({ _id: user_id });

        //get user email
        const user = await User.findOne({ _id: user_id });

        //send mail to user email address


        //send response
        res.status(200).json("Password was reset successfully!");

    }
    catch(err) {
        next(err);
    }
}