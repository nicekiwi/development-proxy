
// Load Deps
import fs from 'fs';
import hoxy from 'hoxy';
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

const path = './certificate';
const filename = `${config.generator}-root-ca`;

// Get the private key and certificate
const key = fs.readFileSync(`${path}/${config.generator}-root-ca.key.pem`);
const cert = fs.readFileSync(`${path}/${config.generator}-root-ca.crt.pem`);

if(!key || !cert) {
  logger.error('You must create keys first.');
  process.exit(1);
}


if(!config.files.length) {
  logger.error('No files defined in ./config.json');
  process.exit(1);
}

// Create Hoxy instance
const proxy = hoxy.createServer({
  certAuthority: { key, cert }
});

// Setup Error Events
proxy.on('error', (e) => {
  switch (e.code) {
    case 'EACCES':
      logger.error(`Use of port ${config.port} requires elevated privileges.`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(`Port ${config.port} is already in use.`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

// Setup Files
config.files.map((file, i) => {

  // Intercept files
  proxy.intercept({
    phase: 'request',
    fullUrl: file.remote
  }, (req, resp, cycle) => {

    logger.info(`Requested: ${file.remote}`);
    logger.info(`Returned: ${file.local}`);

    return cycle.serve({
      path: file.local
    });
  });

});

// Start Hoxy
proxy.listen(config.port, () => {
  logger.info(`Development Proxy listening on https://localhost:${config.port}.`);
});
