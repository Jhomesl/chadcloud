// Packages
const Joi = require('joi')

// Global schema
const { boolean, date, email, string, url } = require('./global.model')

// Utilities
const { get_model_error } = require('../util').error

/**
 * @file Authentication microservice models and error messages
 * @module models/authorization
 * @author Lexus Drumgold <lex@lexusdrumgold.design>
 */

/**
 * @namespace messages - Authentication microservice model error messages
 * @property {string} id_token
 */
const messages = {
  id_token: 'User is not authenticated.'
}

/**
 * @namespace errors - Account microservice errors
 * @property {string} id_token
 */
const errors = {
  id_token: errors => get_model_error(messages.id_token, errors, true)
}

const AuthenticatedQuery = Joi.object().keys({
  id_token: string.required().error(errors.id_token),
}).required().error(errors.query, { self: true })

module.exports = {
  create: Joi.object().keys({ query: AuthenticatedQuery }),
  remove: Joi.object().keys({ query: AuthenticatedQuery })
}

