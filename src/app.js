
// Load Deps
import hoxy from 'hoxy';
import forge from 'node-forge';
import fs from 'fs';

// Load Config
import config from '../config.json';

const key = fs.readFileSync('./pems/root-ca.key.pem');
const cert = fs.readFileSync('./pems/root-ca.crt.pem');

if(!key || !cert)
  throw('You must create keys first.');

// Start Proxy
const proxy = hoxy.createServer({
  certAuthority: { key, cert }
}).listen(config.port, () => {
  console.log('The proxy is listening on port ' + config.port + '.');
});

if(!config.sites.length)
  throw('No Sites defined in ./config.json');

// Setup Sites
config.sites.map((site, i) => {

  proxy.intercept({
    phase: 'request',
    fullUrl: site.remote
  }, (req, resp, cycle) => {
    return cycle.serve({
      path: site.local
    });
  });

});
