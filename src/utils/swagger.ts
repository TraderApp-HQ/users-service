import swaggerJsdoc from 'swagger-jsdoc';
import { version } from "../../package.json"
import { createAuthLogin, createAuthLoginBody, createAuthLogout, createAuthLogoutBody, createAuthPasswordLinkReset, createAuthPasswordLinkResetBody, createAuthPasswordReset, createAuthPasswordResetBody, createAuthRefreshToken, createAuthRefreshTokenBody, createAuthSignup, createAuthSignupBody,  } from '../documentation/auth';
import { ROUTES } from '~/config/constants';

const options: swaggerJsdoc.Options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'User Service API',
      version,
      description: 'API documentation for User Service Trader App',
    },
    components: {
      securitySchemas: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        }
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
      }
    ],
    paths: {
      [`/auth${ROUTES.login}`]: { post: createAuthLogin },
      [`/auth${ROUTES.signup}`]: { post: createAuthSignup },
      [`/auth${ROUTES.logout}`]: { delete: createAuthLogout },
      [`/auth${ROUTES.refresh_token}`]: { post: createAuthRefreshToken },
      [`/auth${ROUTES.password_reset}`]: { post: createAuthPasswordReset },
      [`/auth${ROUTES.password_reset_link}`]: { get: createAuthPasswordLinkReset }
    },
  },
  apis: ['./src/routes/*.ts', './src/models/*.ts'], // Point to your route files
};

const specs = swaggerJsdoc(options);

export default specs;