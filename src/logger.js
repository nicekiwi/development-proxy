
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
if(config.logToFile === true) {
  logger.add(winston.transports.File, { filename: `./logs/${moment().format('DD-MM-YYYY')}.log` });
  logger.info('(Logging to file enabled)');
}

export default logger;
