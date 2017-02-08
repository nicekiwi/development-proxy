
// Load Deps
import fs from 'fs';
import hoxy from 'hoxy';
import upath from 'upath';
import logger from './logger';

// Load Config
import config from '../config.json';

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

    const path = upath.normalize(file.local);
    const strategy = config.replaceRemote ? 'replace' : 'overlay';

    logger.info(`Requested: ${file.remote}`);
    logger.info(`Returned: ${path}`);

    return cycle.serve({ path, strategy });
  });

});

// Start Hoxy
proxy.listen(config.port, () => {
  logger.info(`Development Proxy listening on https://localhost:${config.port}.`);
});
