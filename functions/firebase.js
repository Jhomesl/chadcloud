// Constants
const { FIREBASE_DATABASES } = require('./constants')

// Utilities
const { configure_firebase } = require('./util').global

/**
 * @file Firebase Admin configuration
 * @module firebase
 * @author Lexus Drumgold <lex@lexusdrumgold.design>
 */

const { locations, messages, profiles, rooms } = FIREBASE_DATABASES

/**
 * Firebase application
 * @property {firebase.app.App}
 */
const FIREBASE_APP = configure_firebase()

/**
 * @namespace Firebase - Firebase application and services
 * @property {admin.app.App} Firebase.app - Firebase application
 * @property {admin.auth.Auth} Firebase.auth - Authentication service
 * @property {object} Firebase.databases - Database services
 */
const Firebase = {
  app: FIREBASE_APP,
  auth: FIREBASE_APP.auth(),
  databases: {
    core: FIREBASE_APP.database(),
    locations: FIREBASE_APP.database(locations),
    messages: FIREBASE_APP.database(messages),
    profiles: FIREBASE_APP.database(profiles),
    rooms: FIREBASE_APP.database(rooms)
  }
}

module.exports = { Firebase, ...Firebase }
