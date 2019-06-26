// Packages
const Joi = require('joi')

/**
 * @file Global data models
 * @module models/global
 * @author Lexus Drumgold <lex@lexusdrumgold.design>
 */

module.exports = {
  boolean: Joi.boolean(),
  date: Joi.date().iso(),
  email: Joi.string().email(),
  string: Joi.string(),
  url: Joi.string().uri()
}
