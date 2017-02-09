
// Load Deps
import fs from 'fs';
import forge from 'node-forge';
import checkExisting from './check-existing';
import logger from './logger';

const path = './certificate';
const filename = 'forge-root-ca';

logger.info('Generating Certificate - Via Forge');

// Check if previous certificate exists
checkExisting(`${path}/${filename}.crt.pem`);

const pki = forge.pki;
const keys = pki.rsa.generateKeyPair(2048);
const cert = pki.createCertificate();

const attrs = [
  { name: 'commonName', value: 'development.proxy' },
  { name: 'countryName', value: 'NZ' },
  { shortName: 'ST', value: 'Canterbury' },
  { name: 'localityName', value: 'Christchurch' },
  { name: 'organizationName', value: 'Development Proxy Inc.' }
];

cert.publicKey = keys.publicKey;
cert.serialNumber = '01';
cert.validity.notBefore = new Date();
cert.validity.notAfter = new Date();
cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);

cert.setSubject(attrs);
cert.setIssuer(attrs);

// the actual certificate signing
cert.sign(keys.privateKey);

// Get PEM text
const certificate = pki.certificateToPem(cert);
const privateKey = pki.privateKeyToPem(keys.privateKey);

// now convert and write the files
try {
  fs.writeFileSync(`${path}/${filename}.crt.pem`, certificate);
  logger.info(`Created ${path}/${filename}.crt.pem`);
} catch(err) {
  logger.error(`Error: ${err}`);
}

try {
  fs.writeFileSync(`${path}/${filename}.key.pem`, privateKey);
  logger.info(`Created ${path}/${filename}.key.pem`);
} catch(err) {
  logger.error(`Error: ${err}`);
}

logger.info(`Done.`);
