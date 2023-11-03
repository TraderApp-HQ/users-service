import swaggerJsdoc from 'swagger-jsdoc';
import { version } from "../../package.json"

const options: swaggerJsdoc.Options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'User Service API',
      version,
      description: 'API documentation for your Node.js/Express API',
    },
    components: {
      securitySchemas: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        }
      },
    },
    security: [
      {
        bearerAuth: [],
      }
    ]
  },
  apis: ['./src/routes/*.ts', './src/models/*.ts'], // Point to your route files
};

const specs = swaggerJsdoc(options);

export default specs;