// Packages
const functions = require('firebase-functions')

// Feathers application
const { Feathers } = require('./feathers')

// Constants
const { ENVRIONMENT, PRODUCTION } = require('./constants')

/**
 * @file Cloud Functions entry point
 * @module functions
 * @author Lexus Drumgold <lex@lexusdrumgold.design>
 */

// ! Start server listening sequence or setup Feathers application

for (const name in Feathers) {
  const app = Feathers[name]

  if (ENVRIONMENT !== 'development') {
    app.setup()
  } else {
    app.listen(app.get('ports')[name])
  }
}

if (!PRODUCTION) console.info('Started Cloud services.')

// Export Firebase Functions
module.exports = {
  accounts: functions.https.onRequest(Feathers.accounts),
  authentication: functions.https.onRequest(Feathers.authentication),
  docs: functions.https.onRequest(Feathers.documentation)
}
