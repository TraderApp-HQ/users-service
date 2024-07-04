import { Request } from "express";
import { Role } from "../../config/enums";
import { verifyAccessToken } from "../tokens";
import { IAccessToken } from "../../config/interfaces";
import { RESPONSE_FLAGS } from "../../config/constants";

export async function getAccessTokenPayload(req: Request) {
	// get accessToken from req headers
	const accessToken = req.headers.authorization?.split(" ")[1];

	// check if access token was supplied
	if (!accessToken) {
		const error = new Error("Invalid Token");
		error.name = RESPONSE_FLAGS.unauthorized;
		throw error;
	}

	// verify accessToken and return payload
	const payload = await verifyAccessToken(accessToken);
	return payload as IAccessToken;
}

// A function to get accessToken from headers, verify it and check if user is admin
export async function checkAdmin(req: Request) {
	const user = await getAccessTokenPayload(req);
	if (!user.role.includes(Role.ADMIN) && !user.role.includes(Role.SUPER_ADMIN)) {
		const error = new Error(
			"You don't have the necessary permission to perform this operation.",
		);
		error.name = "Forbidden";
		throw error;
	}
}

export async function checkSuperAdmin(req: Request) {
	const user = await getAccessTokenPayload(req);
	if (!user.role.includes(Role.ADMIN) || !user.role.includes(Role.SUPER_ADMIN)) {
		const error = new Error(
			"You don't have the necessary permission to perform this operation.",
		);
		error.name = "Forbidden";
		throw error;
	}
}

//  check if user exist
export async function checkUser(req: Request) {
	const user = await getAccessTokenPayload(req);
	return user;
}
