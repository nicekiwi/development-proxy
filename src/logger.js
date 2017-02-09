
import moment from 'moment';
import winston from 'winston';

// Load Config
import config from '../config.json';

// Setup Logger
const logger = new (winston.Logger)({
  transports: [
    new winston.transports.Console({
      level: 'info',
      colorize: true,
      prettyPrint: true,
      timestamp: function() {
        return `[${moment().format('hh:mm:ss')}]`;
      }
    })
  ]
});

// Setup Logging to file
if(config.logToFile && config.logToFile === true) {
  const filename = `./logs/${moment().format('DD-MM-YYYY')}.log`;
  logger.add(winston.transports.File, { filename });
  logger.info(`Saving log output to: ${filename}.`);
}

export default logger;
