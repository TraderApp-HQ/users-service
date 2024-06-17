import swaggerJsdoc from "swagger-jsdoc";
import {
	createAuthLogin,
	createAuthLoginBody,
	createAuthLogout,
	createAuthLogoutBody,
	createAuthPasswordLinkReset,
	createAuthPasswordLinkResetBody,
	createAuthPasswordReset,
	createAuthPasswordResetBody,
	createAuthRefreshToken,
	createAuthRefreshTokenBody,
	createAuthSignup,
	createAuthSignupBody,
} from "../documentation/auth";
import { ROUTES } from "../config/constants";

const options: swaggerJsdoc.Options = {
	swaggerDefinition: {
		openapi: "3.0.0",
		info: {
			title: "User Service API",
			version: "1.0.0",
			description: "API documentation for User Service Trader App",
		},
		components: {
			securitySchemas: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
				},
			},
			schemas: {
				createAuthLoginBody,
				createAuthSignupBody,
				createAuthLogoutBody,
				createAuthPasswordResetBody,
				createAuthPasswordLinkResetBody,
				createAuthRefreshTokenBody,
			},
		},
		security: [
			{
				bearerAuth: [],
			},
		],
		paths: {
			[`/auth${ROUTES.login}`]: { post: createAuthLogin },
			[`/auth${ROUTES.signup}`]: { post: createAuthSignup },
			[`/auth${ROUTES.logout}`]: { delete: createAuthLogout },
			[`/auth${ROUTES.refreshToken}`]: { post: createAuthRefreshToken },
			[`/auth${ROUTES.passwordReset}`]: { post: createAuthPasswordReset },
			[`/auth${ROUTES.passwordResetLink}`]: { get: createAuthPasswordLinkReset },
		},
	},
	apis: ["./src/routes/*.ts", "./src/models/*.ts"], // Point to your route files
};

const specs = swaggerJsdoc(options);

export default specs;
