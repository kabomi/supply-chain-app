import express from 'express';
import logger from './logger';

async function main() {
  const app = express();
  app.use(express.json()); // Middleware to parse JSON bodies

  if (process.env.ENV !== 'production') {
    app.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, PATCH');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      next();
    });
  }

  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  const PORT = process.env.PORT || 3000;
  const server = app.listen(PORT);

  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Rejection at: Promise ', { reason });
  });

  process.on('uncaughtException', (error, origin) => {
    if (origin === 'uncaughtException') {
      logger.error('Uncaught Exception:', { error });
      if (error.message.includes('EADDRINUSE')) {
        logger.error('Port is already in use');
        process.exit(1);
      }
    }
  });

  // process.on('SIGUSR2', function () {
  //   console.log('\nGracefully shutting down from SIGUSR2');
  //   server.close();
  //   console.log(`Close the server listening on ${PORT}`);
  // });
  process.on('SIGINT', function () {
    console.log('\nGracefully shutting down from SIGINT (Ctrl-C)');
    server.close();
    console.log(`Close the server listening on ${PORT}`);
    process.exit(0);
  });

  server.on('listening', () => {
    logger.log(`Server listening on ${PORT}`);
  });

  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Rejection at: Promise ', { reason });
  });

  return Promise.resolve(server);
}

export default main();
