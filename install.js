
// const fs = require('fs');
// const forge = require('node-forge');
// const pki = forge.pki;
//
// const keys = pki.rsa.generateKeyPair(2048);
// const cert = pki.createCertificate();
//
// const keyName = 'root-ca';
//
// const attrs = [{
//   name: 'commonName',
//   value: 'development.proxy'
// }, {
//   name: 'countryName',
//   value: 'NZ'
// }, {
//   shortName: 'ST',
//   value: 'Canterbury'
// }, {
//   name: 'localityName',
//   value: 'Christchurch'
// }, {
//   name: 'organizationName',
//   value: 'Development Proxy Inc.'
// }];
//
// console.log('Generating Keys..');
//
// cert.publicKey = keys.publicKey;
// cert.serialNumber = '01';
// cert.validity.notBefore = new Date();
// cert.validity.notAfter = new Date();
// cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);
//
// cert.setSubject(attrs);
// cert.setIssuer(attrs);
//
// // the actual certificate signing
// cert.sign(keys.privateKey);
//
// const keyBuffer = pki.publicKeyToPem(cert.publicKey);
// const certBuffer = pki.certificateToPem(cert);
//
// console.log(keyBuffer);
//
// // now convert and write the files
// fs.writeFileSync(`./pems/${keyName}.crt.pem`, certBuffer, (err) => {
//   if(err) throw(err);
//   console.log(`Created ./pems/${keyName}.crt.pem`);
// });
//
// fs.writeFileSync(`./pems/${keyName}.key.pem`, keyBuffer, (err) => {
//   if(err) throw(err);
//   console.log(`Created ./pems/${keyName}.key.pem`);
// });
//
// console.log('Done.');


// Load Deps
const async = require('async');
const exec = require('child_process').exec;

const filename = 'root-ca';
const CA = '/C=NZ/ST=Canterbury/L=Christchurch/O=Development Proxy Inc./CN=development.proxy';

const commands = [
  `openssl genrsa -out ./pems/${filename}.key.pem 2048`,
  `openssl req -x509 -new -nodes -key ./pems/${filename}.key.pem -days 1024 -out ./pems/${filename}.crt.pem -subj "${CA}"`
];

const execute = (command, callback) => {
  exec(command, (err, stdout, stderr) => {
    if (err) callback(err);
    callback();
  });
};

async.mapSeries(commands, execute, (err, results) => {

  if(err) {
    console.error(`exec error: ${err}`);
    return;
  }

  console.log('Successfully created Key and Certificate files in ./pems.');
});
