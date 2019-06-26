// Utility functions
const auth = require('./auth.util')
const context = require('./context.util')
const error = require('./error.util')
const globals = require('./global.util')

/**
 * @file Utilities entry point
 * @module utilities
 * @author Lexus Drumgold <lex@lexusdrumgold.design>
 */

module.exports = { auth, context, error, global: globals }
