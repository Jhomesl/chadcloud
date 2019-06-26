# :cloud: Chad Cloud

Built with Google Firebase, Chad is a location based chatroom service that
allows users to start and join trending chatrooms in their area. Stay home and
chat or travel the world and join chatrooms around the globe.

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Overview

[Getting Started](#getting-started)  
[Usage](#usage)  
[Contributing](#contributing)  
[Deployment](#deployment)  
[Built With](#built-with)

## Getting Started

Built with Google Firebase, Chad is a location based chatroom service that
allows users to start and join trending chatrooms in their area. Stay home and
chat or travel the world and join chatrooms around the globe. Chad aims to
provide quality communication services without sacrificing user privacy and
trust.

Chad Cloud contains Chad's Firebase Cloud Functions, hosting our
`Authentication`, `Accounts`, `Documentation`, and `Location` microservices.

## Usage

Run `npm start` in the project directory. This will build and launch a local
production version of our cloud functions. When this is complete, you'll see the
following in your terminal:

```bash
i  functions: Preparing to emulate functions.
i  hosting: Serving hosting files from: functions/public
✔  hosting: Local server: http://localhost:5000
Warning: You're using Node.js v11.9.0 but the Google Cloud Functions runtime is only available in Node.js 6 (Deprecated), Node.js 8, and Node.js 10 (Beta). Therefore, results from running emulated functions may not match production behavior.
info: Application initialized. Node environment -> test.
info: Application initialized. Node environment -> test.
Application initialized. Node environment -> test.
info: Application initialized. Node environment -> test.
info: Application initialized. Node environment -> test.
info: Application initialized. Node environment -> test.
info: Application initialized. Node environment -> test.
Application initialized. Node environment -> test.
Application initialized. Node environment -> test.
✔  functions: accounts: http://localhost:5001/chadnetworkbase/us-central1/accounts
✔  functions: documentation: http://localhost:5001/chadnetworkbase/us-central1/documentation
✔  functions: authentication: http://localhost:5001/chadnetworkbase/us-central1/authentication
```

### Making Requests

**Attention: This section is under construction.**

## Contributing

If you're a current member of Chad App, or an outside contributor, please view
our [Guide to Contributing](CONTRIBUTING).

## Deployment

If you're a current member of Chad App, or would just like an overview of
our deployment procedure, please view our [Deployment Guide](DEPLOYMENT.md).

## Built With

- [Feathers][1]
- [Firebase Admin][2]
- [Firebase Cloud Functions][3]
- [Google Maps][4]

[1]: https://docs.feathersjs.com/
[2]: https://firebase.google.com/docs/reference/admin
[3]: https://firebase.google.com/docs/reference/functions
[4]: https://www.npmjs.com/package/@google/maps
