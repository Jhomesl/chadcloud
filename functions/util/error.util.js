// Packages
const {
  BadGateway, BadRequest, Conflict, Forbidden, GeneralError, LengthRequired, NotAuthenticated, NotFound, NotImplemented, MethodNotAllowed, NotAcceptable, PaymentError, Timeout, TooManyRequests, Unavailable, Unprocessable
} = require('@feathersjs/errors')

/**
 * @file Error utility functions
 * @module utilities/error
 * @author Lexus Drumgold <lex@lexusdrumgold.design>
 */

module.exports = {
  /**
   * Creates a new Feathers error based on the status argument.
   *
   * @param {Error | string} error - Error to transform or error message
   * @param {object} data - Additional error data
   * @param {object} data.errors - Typically validation errors or if you want to
   * group multiple errors together
   * @param {number} status - Error status code. Defaults to 500
   * @returns {FeathersError} Feathers error based on the status argument
   * @throws {BadRequest} If error is incorrect type
   */
  feathers_error: (error, data, status = 500) => {
    if (!error) {
      throw new BadRequest('Error argument is required.')
    }

    // Get message from error object or use provided string
    const message = error instanceof Error ? error.message : error

    switch (status) {
      case 400:
        error = new BadRequest(message, data)
        break
      case 401:
        error = new NotAuthenticated(message, data)
        break
      case 402:
        error = new PaymentError(message, data)
        break
      case 403:
        error = new Forbidden(message, data)
        break
      case 404:
        error = new NotFound(message, data)
        break
      case 405:
        error = new MethodNotAllowed(message, data)
        break
      case 406:
        error = new NotAcceptable(message, data)
        break
      case 408:
        error = new Timeout(message, data)
        break
      case 409:
        error = new Conflict(message, data)
        break
      case 411:
        error = new LengthRequired(message, data)
        break
      case 422:
        error = new Unprocessable(message, data)
        break
      case 429:
        error = new TooManyRequests(message, data)
        break
      case 501:
        error = new NotImplemented(message, data)
        break
      case 502:
        error = new BadGateway(message, data)
        break
      case 503:
        error = new Unavailable(message, data)
        break
      default:
        error = new GeneralError(message, data)
    }

    return error
  },

  /**
   * Handles a service method error.
   *
   * @todo Implement error reporting. If report is true, an error will be thrown
   * @param {Feathers.Context} context - Feathers context object
   * @param {boolean} report - If true, send error report. Defaults to false
   * @returns {Feathers.Context} Feathers context object
   * @throws {BadRequest | NotImplemented} If missing context
   */
  handle_service_error: async (context, report = false) => {
    if (!context) throw new BadRequest('Feathers context is required.')

    const { name, message, code, className, data, errors } = context.error

    console.error(`${name}: ${message} ->`, {
      code, name, message, className, data, errors
    })

    if (report) {
      // TODO: Send error report to error service
      throw new NotImplemented('Error reporting in progress.')
    }

    return context
  },

  /**
   * Returns an object containing the name of the function, and the arguments
   * passed in. Meant to be used with a Feathers service method.
   *
   * @param {string} name - Function name
   * @param {object} param1 - Service method arguments
   */
  method_preview: (name, { id, data, params }) => {
    return { name, arguments: { id, data, params } }
  },

  /**
   * Transform a Joi schema error to a Feathers error.
   *
   * @param {string} message - Error message
   * @param {Error[]} errors - Array of Joi errors
   * @returns {BadRequest}
   */
  get_model_error: (message, errors) => {
    return new BadRequest(message, { value: errors[0].context.value })
  }
}
