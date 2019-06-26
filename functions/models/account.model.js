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
 * @property {string} displayName
 * @property {string} email
 * @property {boolean} password
 * @property {string} photoURL
 * @property {boolean} premium
 * @property {string} type
 * @property {string} username
 */
const messages = {
  displayName: 'Display name should be between 1 and 50 characters.',
  birthday: 'Birthday is required and should be in a valid ISO 8601 date format. Users must be at least 13 years old.',
  email: 'Please enter a valid email.',
  password: 'Passwords must be at least 6 characters.',
  photoURL: 'Please enter a valid photo url.',
  premium: 'Premium property is an optional boolean value that defaults to false.',
  type: 'Profile type should be BUSINESS or PERSONAL.',
  username: 'Username is required and should be between 3 and 30 characters.'
}

/**
 * @namespace errors - Account microservice errors
 * @property {string} birthday
 * @property {string} displayName
 * @property {string} email
 * @property {boolean} password
 * @property {string} photoURL
 * @property {boolean} premium
 * @property {string} type
 * @property {string} username
 */
const errors = {
  displayName: errors => get_model_error(messages.displayName, errors),
  birthday: errors => get_model_error(messages.birthday, errors),
  email: errors => get_model_error(messages.email, errors),
  password: errors => get_model_error(messages.password, errors),
  photoURL: errors => get_model_error(messages.photoURL, errors),
  premium: errors => get_model_error(messages.premium, errors),
  type: errors => get_model_error(messages.type, errors),
  username: errors => get_model_error(messages.username, errors)
}

module.exports = {
  create: Joi.object().keys({
    displayName: string.required().error(errors.displayName),
    email: email.required().error(errors.email),
    password: string.min(6).required().error(errors.password),
    photoURL: url.allow(null).error(errors.photoURL),
    uid: string.min(3).max(30).required().error(errors.username)
  }),
  patch: Joi.object().keys({
    birthday: date.required().error(errors.birthday),
    premium: boolean.default(false).error(errors.premium),
    type: string.valid(['BUSINESS', 'PERSONAL']).error(errors.type)
  }),
  update: Joi.object().keys({
    displayName: string.error(errors.displayName),
    email: email.error(errors.email),
    password: string.min(6).error(errors.password),
    photoURL: url.valid(null).error(errors.photoURL)
  })
}
