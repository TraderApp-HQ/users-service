import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcrypt";
import { IUser } from "../types";
import { Roles } from "../config/enums";

export interface IUserModel extends IUser, Document {};

interface UserModel extends Model<IUserModel> {
    login: any
}
// exprt the enums, roles, mongodb URL

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    phone: { type: String, default: ""},
    dob: { type: String, required: true },
    country_id: { type: Number, required: true, ref: "country" },
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    isIdVerified: { type: Boolean, default: false },
    role: { type: String, enum: Roles, default: Roles.USER }
}, { versionKey: false, timestamps: true });

UserSchema.pre("save", async function(next) {
    try {
        let salt = await bcrypt.genSalt(10);
        let tempPass = this.password || '';
        this.password = await bcrypt.hash(tempPass, salt) as unknown as string;
        next();
    }
    catch(err: any) {
        next(err);
    }
});

UserSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });

    if(user) {
        let isPasswordCorrect = await bcrypt.compare(password, user.password);

        if(isPasswordCorrect) return user;
        
        return null;
    }

    return null;
}

export default mongoose.model<IUserModel, UserModel>("user", UserSchema);