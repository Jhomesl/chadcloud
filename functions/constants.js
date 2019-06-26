/**
 * @file Cloud Constants
 * @module constants
 * @author Lexus Drumgold <lex@lexusdrumgold.design>
 */

/**
 * Node environment. development | test | production
 * @property {string} ENVRIONMENT
 */
const ENVRIONMENT = process.env.NODE_ENV

/**
 * @namespace FIREBASE_DATABASES - Database urls
 * @property {string} FIREBASE_DATABASES.core - Main database
 * @property {string} FIREBASE_DATABASES.locations - Locations database
 * @property {string} FIREBASE_DATABASES.messages - Messages database
 * @property {string} FIREBASE_DATABASES.profies - User profiles database
 * @property {string} FIREBASE_DATABASES.rooms - Rooms database
 */
const FIREBASE_DATABASES = {
  core: 'https://chadnetworkbase.firebaseio.com',
  locations: 'https://chadnetworkbase-locations.firebaseio.com',
  messages: 'https://chadnetworkbase-messages.firebaseio.com',
  profies: 'https://chadnetworkbase-users.firebaseio.com',
  rooms: 'https://chadnetworkbase-rooms.firebaseio.com'
}

/**
 * True if Node environment is production.
 * @property {boolean} PRODUCTION
 */
const PRODUCTION = ENVRIONMENT === 'production'

module.exports = {
  ENVRIONMENT, FIREBASE_DATABASES, PRODUCTION
}
