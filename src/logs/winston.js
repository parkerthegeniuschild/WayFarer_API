import appRoot from 'app-root-path';
import winston from 'winston';

const options = {
  file: {
    level: 'debug',
    filename: `${appRoot}/src/logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
};

const logger = winston.createLogger({
  transports: [
    new winston.transports.File(options.file),
  ],
  exitOnError: false,
});

logger.stream = {
  write: (message) => {
    logger.info(message);
  },
};

export default logger;
