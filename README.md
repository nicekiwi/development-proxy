# Development Proxy

Simple development proxy to intercept specified files and load local files instead.

## Requirements

- `Node.js` >= 6.9.0.
- `OpenSSL` (Optional).

## Install

`npm install` will pull in the dependencies and generate the certificates.

## Useage

Run with `npm start`.

Setup your system proxy to point HTTP and HTTPS to localhost and port 8889 (by default). If you used a custom port, you would need set that here too.

### Options

The following options are available in `./config.josn`.

    port: 8889 // The port to listen on.
    generator: "forge" // Which generator to use to create the SSL keys.
    logToFile: false // Weather or not to save the log to file ./logs/DATE.log.
    files: [] // The files to replace.

    // Files array object
    {
      remote: "https://www.example.com/js/app.js",
      local: "C:\files\app.js"
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

`// ToDo`

#### Linux

`// ToDo`

## To Do

- Normalize paths over different Operating Systems.
- Allow pattern matching of remote and local paths.

## License

MIT.
