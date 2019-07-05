// Utilities
const { precheck } = require('../util').context

/**
 * @file Account service hooks
 *
 * @todo Add documentation
 *
 * @module hooks/account
 * @author Lexus Drumgold <lex@lexusdrumgold.design>
 */

module.exports = {
  before: {
    create: async context => precheck(context, 'account', 'create'),
    find: async context => precheck(context, 'account', 'find', true, true),
    get: async context => precheck(context, 'account', 'get', true),
    patch: async context => precheck(context, 'account', 'patch', true),
    update: async context => precheck(context, 'account', 'update', true),
    remove: async context => precheck(context, 'account', 'remove', true),
  }
}
