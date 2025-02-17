import logger from './logger';
import app from './app';
import { initialize } from './persistence/dbConnection';

async function main() {
  // Initialize Db/DbConnection
  await initialize();
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
