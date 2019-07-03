// Packages
const Joi = require('joi')

// Global schema
const { boolean, date, email, string, url } = require('./global.model')

// Utilities
const { get_model_error } = require('../util').error

/**
 * @file Account microservice models and error messages
 * @module models/account
 * @author Lexus Drumgold <lex@lexusdrumgold.design>
 */

/**
 * @namespace messages - Account microservice model error messages
 * @property {string} birthday
 * @property {string} business
 * @property {string} data
 * @property {string} displayName
 * @property {string} email
 * @property {string} id_token
 * @property {string} password
 * @property {string} photoURL
 * @property {string} premium
 * @property {string} query
 */
const messages = {
  birthday: 'Birthday is required and should be in a valid ISO 8601 date format. Users must be at least 16 years old.',
  business: 'Business property is an optional boolean value that defaults to false.',
  data: 'Payload required.',
  displayName: 'Display name should be between 1 and 50 characters.',
  email: 'Please enter a valid email.',
  id_token: 'User is not authenticated.',
  password: 'Passwords must be at least 6 characters.',
  photoURL: 'Please enter a valid photo url.',
  premium: 'Premium property is an optional boolean value that defaults to false.',
  query: 'Query required.'
}

/**
 * @namespace errors - Account microservice errors
 * @property {string} birthday
 * @property {string} business
 * @property {string} data
 * @property {string} displayName
 * @property {string} email
 * @property {string} id_token
 * @property {string} password
 * @property {string} photoURL
 * @property {string} premium
 * @property {string} query
 */
const errors = {
  birthday: errors => get_model_error(messages.birthday, errors),
  business: errors => get_model_error(messages.business, errors),
  data: errors => get_model_error(messages.data, errors),
  displayName: errors => get_model_error(messages.displayName, errors),
  email: errors => get_model_error(messages.email, errors),
  id_token: errors => get_model_error(messages.id_token, errors, true),
  password: errors => get_model_error(messages.password, errors),
  photoURL: errors => get_model_error(messages.photoURL, errors),
  premium: errors => get_model_error(messages.premium, errors),
  query: errors => get_model_error(messages.query, errors)
}

const AuthenticatedQuery = Joi.object().keys({
  id_token: string.required().error(errors.id_token),
}).required().error(errors.query, { self: true })

module.exports = {
  create: Joi.object().keys({
    data: Joi.object().keys({
      displayName: string.required().error(errors.displayName),
      email: email.required().error(errors.email),
      password: string.min(6).required().error(errors.password),
      photoURL: url.allow(null).error(errors.photoURL)
    }).required().error(errors.data, { self: true })
  }),
  find: Joi.object().keys({ query: AuthenticatedQuery }),
  get: Joi.object().keys({ query: AuthenticatedQuery }),
  patch: Joi.object().keys({
    query: AuthenticatedQuery,
    data: Joi.object().keys({
      business: boolean.default(false).error(errors.business),
      birthday: date.required().error(errors.birthday),
      premium: boolean.default(false).error(errors.premium)
    }).required().error(errors.data, { self: true })
  }),
  update: Joi.object().keys({
    query: AuthenticatedQuery,
    data: Joi.object().keys({
      displayName: string.error(errors.displayName),
      email: email.error(errors.email),
      password: string.min(6).error(errors.password),
      photoURL: url.valid(null).error(errors.photoURL)
    }).required().error(errors.data, { self: true })
  }),
  remove: Joi.object().keys({ query: AuthenticatedQuery })
}
