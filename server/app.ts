import express from 'express';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import services from './services';

const app = express();

if (process.env.ENV === 'development') {
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });
} else {
  app.disable('x-powered-by'); // less hackers know about our stack
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
    servers: [{ url: `http://localhost:${process.env.PORT}/api` }],
  },
  apis: ['server/services/*.ts'], // Path to the API docs
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api', services);

export default app;
