
const read = require('read-yaml');
const hoxy = require('hoxy');
const fs = require('fs');

let config = read.sync('./.config.example.yaml');

let proxy = hoxy.createServer({
  certAuthority: {
    key: fs.readFileSync('./my-private-root-ca.key.pem'),
    cert: fs.readFileSync('./my-private-root-ca.crt.pem')
  }
}).listen(config.port, function() {
  console.log('The proxy is listening on port ' + config.port + '.');
});

proxy.intercept('request', req => {
  req.headers['x-unicorns'] = 'unicorns';
  // server will now see the "x-unicorns" header
  console.log(req.body);
});
