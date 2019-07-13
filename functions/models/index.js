// Models
const account = require('./account.model')
const globals = require('./global.model')

/**
 * @file Data models
 * @module models
 * @author Lexus Drumgold <lex@lexusdrumgold.design>
 */

module.exports = {
  account,
  global: globals,
  options: { abortEarly: false, escapeHtml: false, stripUnknown: true }
}
