// Packages
const functions = require('firebase-functions')

// Feathers application
const { Feathers } = require('./feathers')

// Constants
const { ENVRIONMENT } = require('./constants')

/**
 * @file Cloud Functions entry point
 * @module functions
 * @author Lexus Drumgold <lex@lexusdrumgold.design>
 */

// ! Start server listening sequence if Node environment isn't production
if (ENVRIONMENT === 'development') {
  for (const name in Feathers) {
    const app = Feathers[name]

    const host = app.get('host')
    const ports = app.get('ports')

    app.listen(ports[name], () => {
      if (host) {
        const message = `${name} service started on http://%s:%d`
        console.info(message, host, ports[name])
      }
    })
  }
}

// Export Firebase Functions
module.exports = {
  accounts: functions.https.onRequest(Feathers.accounts),
  authentication: functions.https.onRequest(Feathers.authentication),
  documentation: functions.https.onRequest(Feathers.documentation)
}
