import swaggerJsdoc from 'swagger-jsdoc';
import { version } from "../../package.json"
import { createAuthLogin, createAuthLoginBody, createAuthLogout, createAuthLogoutBody, createAuthPasswordLinkReset, createAuthPasswordLinkResetBody, createAuthPasswordReset, createAuthPasswordResetBody, createAuthRefreshToken, createAuthRefreshTokenBody, createAuthSignup, createAuthSignupBody,  } from '../documentation/auth';

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
      '/auth/login': {
        post: createAuthLogin,
      },
      '/auth/signup': {
        post: createAuthSignup
      },
      '/auth/logout': {
        delete: createAuthLogout,
      },
      '/auth/refresh-token': {
        post: createAuthRefreshToken
      },
      '/auth/password-reset': {
        post: createAuthPasswordReset
      },
      '/auth/password-reset/:email': {
        get: createAuthPasswordLinkReset
      }
    },
  },
  apis: ['./src/routes/*.ts', './src/models/*.ts'], // Point to your route files
};

const specs = swaggerJsdoc(options);

export default specs;