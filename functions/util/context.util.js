// Packages
const { BadRequest, NotAuthenticated } = require('@feathersjs/errors')

// Utility functions
const { authenticate } = require('./auth.util')
const { validate_schema } = require('./global.util')

/**
 * @file Feathers Context utilities
 * @module utilities/context
 * @author Lexus Drumgold <lex@lexusdrumgold.design>
 */

module.exports = {
  /**
   * Authenticates a request. If admin is true, the function will check if user
   * is an admin. Admin defaults to false.
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
  authenticate: async (context, admin = false) => {
    let { app, params, id } = context

    // Don't authenticate if call is from the server
    if (!params || (params && !params.provider)) return context

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
   * Validates query and payload schema.
   * 
   * @param {Feathers.Context} context - Feathers context object
   * @param {object} context.data - Payload to validate
   * @param {object} context.params - Additional info for the service method
   * @param {object} context.params.query - Query to validate
   * @param {Joi.Schema} schema - Joi schema
   * @param {object} options - Joi options
   */
  check_data: async (context, schema, options) => {
    try {
      const req = { query: context.params.query, data: context.data }
      const { query, data } = validate_schema(req, schema, options)

      context.params.query = query
      context.data = data

      return context
    } catch (err) {
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
  },

  /**
   * Validates @see context.data and authenticates a user if @see auth is true.
   * If @see admin is true and @see auth is true, the function will check if the
   * user is an admin.
   * 
   * @param {Feathers.Context} context - Feathers context object
   * @param {object} context.data - Payload to validate
   * @param {object} context.params - Additional info for the service method
   * @param {object} context.params.query - Query to validate
   * @param {string} context.params.query.id_token - User id token
   * @returns {object} Modified context object
   */
  precheck: async (context, type, method, auth = false, admin = false) => {
    const { authenticate, check_data } = module.exports

    const models = context.app.get('models')
    const schema_type = models[type]
    const schema = schema_type[method]

    try {
      context = check_data(context, schema, models.options)
      return auth ? await authenticate(context, admin) : context
    } catch (err) {
      throw err
    }
  }
}
