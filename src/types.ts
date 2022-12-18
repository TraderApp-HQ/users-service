export interface IUser {
    email: string;
    password: string,
    phone?: string;
    first_name: string;
    last_name: string;
    country_id: number;
    dob: string;
    isEmailVerified?: boolean;
    isPhoneVerified?: boolean;
    isIdVerified?: boolean;
    role?: number;
}

export interface ICountry {
    _id: number
    name: string,
    code: string,
    flag: string,
    capital: string,
    dial_code: string,
    currency: { name: string, code: string, symbol: string },
    continent: string
}

export interface IRole {
    _id: number,
    description: string
}

export interface Payload {
    id: string,
    first_name: string,
    last_name: string,
    phone: string,
    email: string,
    dob: string,
    isPhoneVerified: boolean,
    isEmailVerified: boolean,
    isIdVerified: boolean,
    role: number
}

export interface RefreshToken {
    refresh_token: string,
    expireAt: Date
}

export interface ResetToken {
    reset_token: string,
    expireAt: Date
}