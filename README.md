# Development Proxy

A simple development proxy I built to help me by intercepting configured files and load local files instead. I wanted a dedicated replacement to Fiddler and Charles Proxy.

Powered by [Hoxy](https://github.com/greim/hoxy) the Web-hacking proxy API for node.

## Requirements

- `Node.js` >= 6.9.0.

`OpenSSL` is not required, but you can use it if you want to.

## Install

**Clone the Repo**  
`git clone git@github.com:nicekiwi/development-proxy.git`

**Install the dependencies**  
`npm install`.

## Usage

By default the development-proxy listens on HTTPS for maximum compatibility.

**Generate SSL Certificate**  
`npm run generate` or `node index.js --generate`.

If you want to use `OpenSSL` instead of `node-forge` to generate the certificate, run `node index.js --generate=openssl` instead.

**Start the Proxy**  
`npm start` or `node index.js`.

**Setup your system's proxy**  
Setup your system proxy to point `HTTP` and `HTTPS` to `localhost` and port `8889` (by default). If you set a custom port in your `./config.json` file, you would need set that here too.

## Config

### Options

The following options are available in `./config.josn`.

| Option | Type | Default | Description |
| :-- | :-- | :-- | :-- |
| `port` | Number | `8889` | The port to listen on. |
| `certificate` | String | `forge` | Which certificate to use, `forge` or `openssl`. |
| `logToFile` | Boolean | `false` | Weather or not to save the log to file `./logs/DD-MM-YYYY.log`. |
| `strict` | Boolean | `true` | `true` will return a 404 response if the local file is not found, `false` will return the remote file instead. |
| `localRoot` | String | `/` | *(Optional)* The absolute path to where local files should be served from, defaults to the local drive's root, e.g. `/` or `c:/`. |
| `files` | Array | `[]` | The files to replace. |

**Files Array Object:**

| Option | Type | Description |
| :-- | :-- | :-- |
| `remote` | String | The remote file to intercept *(can use basic pattern matching)*. |
| `local` | String | Relative to the localRoot *(if set)* or to the absolute path from the disk drive's root, e.g. `/` or `c:/` of the local file to return. |

#### Example

	{
	  "port": 8889,
	  "certificate": "forge",
	  "logToFile": true,
	  "strict": true,
	  "localRoot": "C:/Users/Ezra/Documents/Developer",
	  "files": [
	    {
	      "remote":"https://nice.kiwi/assets/stylesheets/app.css",
	      "local":"/nice-kiwi-blog/assets/stylesheets/app.css"
	    },
			{
	      "remote":"https://nice.kiwi/assets/javascript/app.js",
	      "local":"/nice-kiwi-blog/assets/javascript/app.js"
	    }
	  ]
	}


### Trust the Certificate

To avoid warnings about self-signed certificates, you must instruct your system to trust the certificate. You should only need to do this once (assuming you only generate the certificate once).

#### Windows

[Manage Trusted Root Certificates in Windows 10 / 8](http://www.thewindowsclub.com/manage-trusted-root-certificates-windows)

#### Mac

1. Open the `./certificate` directory.
2. Double click the file with the extension `.crt.pem` to add it to the Keychain Access app under the `System` keychain.
3. Then find it by the name `development.proxy` and double click it to edit it
4. Under `Trust` > `When using this certificate` set it to `Always Trust`.
5. Close the Keychain Access app.
6. Restart your browser and the certificate should be trusted.

#### Linux

`// ToDo`

## To Do

- Write tests.

## License

MIT.
