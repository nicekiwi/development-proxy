'use strict';

// Pull in Babel
require('babel-core/register');
require('babel-polyfill');

// get cmd arguments (if any)
const yargs = require('yargs').argv;

// pick an option
switch (yargs.generate) {
  case 'openssl':
    require('./src/install-openssl.js');
    break;
  case true:
    require('./src/install-forge.js');
    break;
  default:
    require('./src/app.js');
}
