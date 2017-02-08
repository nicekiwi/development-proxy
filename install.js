'use strict';

// Pull in Babel
require('babel-core/register');
require('babel-polyfill');

// Load Installer
require(`./src/install-${require('./config.json').generator}.js`);
