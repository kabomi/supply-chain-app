import express from 'express';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import services from './services';
import { itemSchema } from './schemas';
import {
  authMiddleware,
  corsMiddleware,
  optionsMiddleware,
} from './middleware';
import supplyChainDefinitions from './services/supply-chain.definitions.json';

const app = express();

app.use(corsMiddleware);

if (process.env.ENV !== 'development') {
  app.options('*', optionsMiddleware);
  app.disable('x-powered-by'); // less hackers know about our stack
  app.use(authMiddleware);
}

app.use(express.json()); // Middleware to parse JSON bodies

// Swagger definition
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.1.0',
    info: {
      title: 'Supply Chain Management API',
      version: '1.0.0',
      description: 'API for managing supply chain operations',
    },
    components: {
      schemas: {
        Item: itemSchema,
      },
      securitySchemes: {
        basicAuth: {
          type: 'http',
          scheme: 'basic',
        },
      },
      security: [
        {
          basicAuth: [],
        },
      ],
    },
    paths: supplyChainDefinitions.paths,
    servers: [{ url: `http://localhost:${process.env.PORT || 3000}/api` }],
  },
  apis: ['server/services/*.ts'], // Path to the API docs
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api', services);

export default app;
