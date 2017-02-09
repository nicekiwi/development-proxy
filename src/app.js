
// Load Deps
import fs from 'fs';
import hoxy from 'hoxy';
import upath from 'upath';
import fileExists from 'file-exists';
import logger from './logger';

// Load Config
import config from '../config.json';

// validate config
const options = {
  port: config.port || 8889,
  certificate: config.certificate || 'forge',
  logToFile: config.logToFile || false,
  strict: config.strict || false,
  localRoot: config.localRoot || '/',
  files: config.files || []
};

const path = upath.join(__dirname, '../certificate');
const filename = `${options.certificate}-root-ca`;

// Get the private key and certificate
if(!fileExists.sync(`${path}/${filename}.crt.pem`)) {
  logger.error('A Certificate file was not found in ./certificate.');
  process.exit(1);
}

if(!options.files.length) {
  logger.error('No files have been defined in ./config.json');
  process.exit(1);
}

// Create Hoxy instance
const proxy = hoxy.createServer({
  certAuthority: {
    key: fs.readFileSync(`${path}/${filename}.key.pem`),
    cert: fs.readFileSync(`${path}/${filename}.crt.pem`)
  }
});

// Setup Error Events
proxy.on('error', (e) => {
  switch (e.code) {
    case 'EACCES':
      logger.error(`Use of port ${options.port} requires elevated privileges.`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(`Port ${options.port} is already in use.`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

// Setup Files
options.files.map((file, i) => {

  // Intercept files
  proxy.intercept({
    phase: 'request',
    fullUrl: file.remote
  }, (req, resp, cycle) => {

    const path = upath.normalize(file.local);
    const docroot = upath.normalize(options.localRoot);
    const strategy = options.strict ? 'replace' : 'overlay';

    logger.info(`Requested: ${file.remote}`);
    logger.info(`Returned: ${upath.join(docroot, path)}`);

    return cycle.serve({ path, strategy, docroot });
  });

});

// Start Hoxy
proxy.listen(options.port, () => {
  logger.info(`Development Proxy listening on https://localhost:${options.port}.`);
});
