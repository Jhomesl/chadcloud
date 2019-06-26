// Packages
const feathers = require('@feathersjs/feathers')

/**
 * @file Global service hooks
 *
 * @todo Add documentation and refactor
 *
 * @author Lexus Drumgold <lex@lexusdrumgold.design>
 */

module.exports = {
  before: {
    all: context => process.env.NODE_ENV !== 'test' ? context : feathers.SKIP,
    create: context => {
      const { log_request } = context.app.get('utilities').context
      return log_request(context)
    },
    find: context => {
      const { log_request } = context.app.get('utilities').context
      return log_request(context)
    },
    get: context => {
      const { log_request } = context.app.get('utilities').context
      return log_request(context)
    },
    patch: context => {
      const { log_request } = context.app.get('utilities').context
      return log_request(context)
    },
    update: context => {
      const { log_request } = context.app.get('utilities').context
      return log_request(context)
    },
    remove: context => {
      const { log_request } = context.app.get('utilities').context
      return log_request(context)
    }
  },
  after: {
    all: context => process.env.NODE_ENV !== 'test' ? context : feathers.SKIP,
    create: async context => {
      const { log_success } = context.app.get('utilities').context
      return log_success(context)
    },
    find: async context => {
      const { log_success } = context.app.get('utilities').context
      return log_success(context)
    },
    get: async context => {
      const { log_success } = context.app.get('utilities').context
      return log_success(context)
    },
    patch: async context => {
      const { log_success } = context.app.get('utilities').context
      return log_success(context)
    },
    update: async context => {
      const { log_success } = context.app.get('utilities').context
      return log_success(context)
    },
    remove: async context => {
      const { log_success } = context.app.get('utilities').context
      return log_success(context)
    }
  },
  error: {
    all: context => process.env.NODE_ENV !== 'test' ? context : feathers.SKIP,
    create: async context => {
      const { handle_service_error } = context.app.get('utilities').error
      await handle_service_error(context)
    },
    find: async context => {
      const { handle_service_error } = context.app.get('utilities').error
      await handle_service_error(context)
    },
    get: async context => {
      const { handle_service_error } = context.app.get('utilities').error
      await handle_service_error(context)
    },
    patch: async context => {
      const { handle_service_error } = context.app.get('utilities').error
      await handle_service_error(context)
    },
    update: async context => {
      const { handle_service_error } = context.app.get('utilities').error
      await handle_service_error(context)
    },
    remove: async context => {
      const { handle_service_error } = context.app.get('utilities').error
      await handle_service_error(context)
    }
  }
}
