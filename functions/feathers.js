// Firebase, global service hooks, models, services, and utility functions
const Firebase = require('./firebase')
const hooks = require('./hooks/global.hooks')
const models = require('./models')
const services = require('./services')
const utilities = require('./util')

/**
 * @file Feathers application config
 * @module feathers
 * @author Lexus Drumgold <lex@lexusdrumgold.design>
 */

const { configure_feathers } = utilities.global

/**
* @namespace Feathers - Feathers applications
* @property {feathers.Application} Feathers.accounts - Accounts app
* @property {feathers.Application} Feathers.authentication - Authentication app
* @property {feathers.Application} Feathers.documentation - Documentation app
*/
const Feathers = {
  accounts: configure_feathers(services.accounts),
  authentication: configure_feathers(services.authentication),
  documentation: configure_feathers(services.documentation)
}

// Add Firebase, global service hooks, models, and utilities to application
for (const app_name in Feathers) {
  const app = Feathers[app_name]

  app.hooks(hooks)

  app.set('firebase/admin', Firebase.app)
  app.set('models', models)
  app.set('utilities', utilities)
}

module.exports = { Feathers, ...Feathers }
