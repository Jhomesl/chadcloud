// Services
const Account = require('./account.service')
const Authentication = require('./auth.service')
const Documentation = require('./documentation.service')

/**
 * @file Services entry points
 * @module services
 * @author Lexus Drumgold <lex@lexusdrumgold.design>
 */

module.exports = {
  accounts: app => app.configure(Account),
  authentication: app => app.configure(Authentication),
  documentation: app => app.configure(Documentation)
}
