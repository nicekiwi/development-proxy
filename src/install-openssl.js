
// Load Deps
import async from 'async';
import { exec } from 'child_process';

const filename = 'openssl-root-ca';
const path = './certificate'
const CA = '/C=NZ/ST=Canterbury/L=Christchurch/O=Development Proxy Inc./CN=development.proxy';

const commands = [
  `openssl genrsa -out ${path}/${filename}.key.pem 2048`,
  `openssl req -x509 -new -nodes -key ${path}/${filename}.key.pem -days 1024 -out ${path}/${filename}.crt.pem -subj "${CA}"`
];

const execute = (command, callback) => {
  exec(command, (err, stdout, stderr) => {

    console.log(command);

    if (err) callback(err ? err : null);
    else callback();
  });
};

console.log('Generating Keys..');

async.mapSeries(commands, execute, (err, results) => {

  if(err) {
    console.error(`Error: ${err}`);
    return;
  }

  console.log(`Done.`);
});
