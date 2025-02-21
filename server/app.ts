import express from 'express';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import services from './services';
import { itemSchema } from './schemas';

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
  // use basic-auth to protect the API
  app.use((req, res, next) => {
    const auth = {
      login: process.env.BASIC_AUTH_USERNAME,
      password: process.env.BASIC_AUTH_PASSWORD,
    };
    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [login, password] = Buffer.from(b64auth, 'base64')
      .toString()
      .split(':');
    if (
      !login ||
      !password ||
      login !== auth.login ||
      password !== auth.password
    ) {
      res.set('WWW-Authenticate', 'Basic realm="401"');
      res.status(401).send('Authentication required.');
      return;
    }
    next();
  });
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
    },
    servers: [{ url: `http://localhost:${process.env.PORT}/api` }],
  },
  apis: ['server/services/*.ts'], // Path to the API docs
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api', services);

export default app;
