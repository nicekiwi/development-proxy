import fileExists from 'file-exists';
import readlineSync from 'readline-sync';
import logger from './logger';

 export default (path) => {

   // Check if previous certificate exists
   if(fileExists.sync(path)) {

    // if so ask to overwrite it
     if(!readlineSync.keyInYN('Certificate already exists, overwrite?')) {
       logger.info('Certificate has not been over-written.');
       process.exit(1);
     } else {
       logger.info('OK, Overwriting previous Certificate.');
     }
   }
 };
