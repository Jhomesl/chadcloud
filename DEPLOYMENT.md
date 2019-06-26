# Deployment

Below you'll find instructions on how to deploy the our Cloud Functions to Firebase,
making them accessible from our Cloud url and any Firebase Hosting site that
implements the `rewrites` found in [`firebase.json`](firebase.json).

## Overview

[Prerequisites](#prerequisites)  
[Deploy to Firebase](#deploy-to-firebase)  

## Prerequisites

Follow the [Guide to Contributing](CONTRIBUTING.md) for detailed instructions on
development, testing, and making a pull request.

## Deploy to Firebase

After an administrator has reviewed your changes, you'll be given the go-ahead
to deploy to Firebase. When deploying, you have to two options:

1. Run `npm run deploy` in the project directory.
2. Run `firebase deploy -m "<DEPLOY_MESSAGE>"` in the project directory.

After the deployment is complete, you'll see the following in your terminal:

```bash
=== Deploying to 'chadnetworkbase'...

i  deploying functions, hosting
Running command: NODE_ENV=production npm run functions-install
✔  functions: Finished running predeploy script.
i  functions: ensuring necessary APIs are enabled...
✔  functions: all necessary APIs are enabled
i  functions: preparing functions directory for uploading...
i  functions: packaged functions (110.72 KB) for uploading
✔  functions: functions folder uploaded successfully
i  hosting[chadnetworkbase]: beginning deploy...
i  hosting[chadnetworkbase]: found 1 files in functions/public
✔  hosting[chadnetworkbase]: file upload complete
i  functions: creating Node.js 10 (Beta) function accounts(us-central1)...
i  functions: creating Node.js 10 (Beta) function authentication(us-central1)...
i  functions: creating Node.js 10 (Beta) function documentation(us-central1)...
✔  functions[accounts(us-central1)]: Successful create operation. 
Function URL (accounts): https://us-central1-chadnetworkbase.cloudfunctions.net/accounts
✔  functions[documentation(us-central1)]: Successful create operation. 
Function URL (documentation): https://us-central1-chadnetworkbase.cloudfunctions.net/documentation
✔  functions[authentication(us-central1)]: Successful create operation. 
Function URL (authentication): https://us-central1-chadnetworkbase.cloudfunctions.net/authentication
i  hosting[chadnetworkbase]: finalizing version...
✔  hosting[chadnetworkbase]: version finalized
i  hosting[chadnetworkbase]: releasing new version...
✔  hosting[chadnetworkbase]: release complete

✔  Deploy complete!

Please note that it can take up to 30 seconds for your updated functions to propagate.
Project Console: https://console.firebase.google.com/project/chadnetworkbase/overview
Hosting URL: https://chadnetworkbase.firebaseapp.com
```
