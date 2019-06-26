// Packages
const { BadRequest, NotAuthenticated } = require('@feathersjs/errors')

// Utility functions
const { authenticate } = require('./auth.util')

/**
 * @file Feathers Context utilities
 * @module utilities/context
 * @author Lexus Drumgold <lex@lexusdrumgold.design>
 */

module.exports = {
  /**
   * Authenticates a request. If admin is true, the function will check if user
   * is an admin. Admin defaults to true.
   *
   * @async
   * @param {feathers.Context} context - Feathers context object
   * @param {object} context.params - Additional info for the service method
   * @param {object| undefined} context.params.user - Decoded id token
   * @param {object} context.params.query - Options
   * @param {string} context.params.query.token - Id token
   * @param {Promise<boolean>} admin - If true, check if user is an admin.
   * @returns {Promise<object>} Updated context object
   * @throws {NotAuthenticated}
   */
  authenticate: async (context, admin = true) => {
    let { app, params, id } = context

    // Don't authenticate if call is from the server
    if (!params.provider) return context

    const authentication = app.get('firebase/admin').auth()

    // Check if auth query exists
    const query_exists = params.query && params.query.token
    if (!query_exists) throw new NotAuthenticated('Id token is required.')

    try {
      // Verify id token and if @see admin is true, check if user is an admin
      params.user = authenticate(authentication, params.query.token, id, admin)

      return context
    } catch (err) {
      err.data.errors = { id_token: params.query.token }
      throw err
    }
  },

  /**
   * This function logs the provided message if the current Node environment is
   * development or test.
   *
   * @param {feathers.Context} context - Feathers context object
   * @param {string} message - Message to log based on Node environment
   * @returns {feathers.Context}
   */
  log_based_on_env: (context, message) => {
    const { app, data, id, params, result } = context

    if (app.get('node_env') !== 'production') {
      console.info(message, result || { data, id, params })
    }

    return context
  },

  /**
   * Logs a new service method request.
   *
   * @async
   * @param {Feathers.Context} context - Feathers context object
   * @returns {Feathers.Context} Feathers context object
   * @throws {BadRequest}
   */
  log_request: async context => {
    if (!context) throw new BadRequest('Feathers context is required.')

    const { data, id, params, path, method } = context

    console.info(`New ${method} request on path /${path} ->`, {
      data: data || null, id: id || null, query: params.query || null
    })
  },

  /**
   * Logs a new service method success.
   *
   * @async
   * @param {Feathers.Context} context - Feathers context object
   * @param {Function} report - If defined, report will attempted to be sent
   * @returns {Feathers.Context} Feathers context object
   * @throws {BadRequest}
   */
  log_success: async (context, report) => {
    if (!context) throw new BadRequest('Feathers context is required.')

    const { path, method, result } = context

    console.info(`New ${method} success on path /${path} ->`, result)

    try {
      if (report) await report()
      return context
    } catch (err) {
      console.error('Reporting error ->', err)
    }
  }
}
