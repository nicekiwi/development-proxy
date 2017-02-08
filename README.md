# Development Proxy

A simple development proxy I built to help me by intercepting configured files and load local files instead. I wanted a dedicated replacement to Fiddler and Charles Proxy.

Powered by [Hoxy](https://github.com/greim/hoxy) the Web-hacking proxy API for node.

## Requirements

- `Node.js` >= 6.9.0.
- `OpenSSL` (Optional).

## Install

`npm install` will pull in the dependencies and generate the SSL certificate.

## Useage

Run with `npm start`.

Setup your system proxy to point HTTP and HTTPS to localhost and port `8889` (by default). If you used a custom port, you would need set that here too.

### Options

The following options are available in `./config.josn`.

    port: 8889 // The port to listen on.
    generator: "forge" // Which generator to use to create the SSL keys.
    logToFile: false // Weather or not to save the log to file ./logs/DATE.log.
    replaceRemote: false // Weather or not to replace the remote file with local, if false and the file is not found locally; the proxy will return the remote file. If true and the file is not found locally; the proxy will return a 404 response.
    files: [] // The files to replace.

    // Files array object
    {
      remote: "https://www.example.com/js/app.js",
      local: "c:/files/app.js" // this path is absolute from the disk drive's root, e.g. "/" or "c:/".
    }

### HTTPS

Most sites should be using SSL by now, so we listen with HTTP by default.

A private key and certificate were created for you during installation. If you do not see them in `./certificate`, run `npm install` again.

By default `openssl` is not required and the certificate is created with `node-forge`, but you can set the installer to use `openssl` in the conifg file if you prefer.

### Trust the Certificate

To avoid warnings about self-signed certificates, you must instruct your system to trust the certificate.

#### Windows

`// ToDo`

#### Mac

1. Open the `./certificate` directory.
2. Double click the file with the extension `.crt.pem` to add it to the Keychain Access app under the `System` keychain.
3. Then find it by the name "development.proxy" and double click it to edit it
4. Under `Trust` > `When using this certificate` set it to `Always Trust`.
5. Close the Keychain Access app.
6. Restart your browser and the certificate should be trusted.

#### Linux

`// ToDo`

## To Do

- Write tests.

## License

MIT.
