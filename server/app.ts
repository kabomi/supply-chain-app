import express from 'express';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import services from './services';
import { itemSchema } from './schemas';

const app = express();

if (process.env.ENV === 'development') {
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'POST, GET, PUT, PATCH, DELETE, OPTIONS'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });
} else {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL);
    res.setHeader(
      'Access-Control-Allow-Methods',
      'POST, GET, PUT, PATCH, DELETE, OPTIONS'
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, Content-Type, Accept, Authorization'
    );
    next();
  });
  app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL);
    res.setHeader(
      'Access-Control-Allow-Methods',
      'POST, GET, PUT, PATCH, DELETE, OPTIONS'
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, Content-Type, Accept, Authorization'
    );
    res.sendStatus(204);
  });
  app.disable('x-powered-by'); // less hackers know about our stack

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
    servers: [{ url: `http://localhost:${process.env.PORT || 3000}/api` }],
  },
  apis: ['server/services/*.ts'], // Path to the API docs
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api', services);

export default app;
