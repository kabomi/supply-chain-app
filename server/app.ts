import express from 'express';
import services from './services';

const app = express();

if (process.env.ENV === 'development') {
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });
}

app.use(express.json()); // Middleware to parse JSON bodies

app.use('/api', services);

export default app;
