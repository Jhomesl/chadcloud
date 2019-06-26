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
    create: context => {
      const utilities = context.app.get('utilities')
      const { account, options } = context.app.get('models')

      const { validate_schema } = utilities.global

      try {
        context.data = validate_schema(context.data, account.create, options)
        return context
      } catch (err) {
        throw err
      }
    },
    find: async context => {
      const utilities = context.app.get('utilities')
      const { authenticate } = utilities.context

      try {
        return await authenticate(context, true)
      } catch (err) {
        throw err
      }
    },
    get: async context => {
      const utilities = context.app.get('utilities')
      const { authenticate } = utilities.context

      try {
        return await authenticate(context, false)
      } catch (err) {
        throw err
      }
    },
    patch: async context => {
      const utilities = context.app.get('utilities')
      const { account, options } = context.app.get('models')
      const { authenticate } = utilities.context

      const { validate_schema } = utilities.global

      try {
        context = await authenticate(context, false)
        context.data = validate_schema(context.data, account.patch, options)
        return context
      } catch (err) {
        throw err
      }
    },
    update: async context => {
      const utilities = context.app.get('utilities')
      const { account, options } = context.app.get('models')
      const { authenticate } = utilities.context

      const { validate_schema } = utilities.global

      try {
        context = await authenticate(context, false)
        context.data = validate_schema(context.data, account.update, options)
        return context
      } catch (err) {
        throw err
      }
    },
    remove: async context => {
      const utilities = context.app.get('utilities')
      const { authenticate } = utilities.context

      try {
        return await authenticate(context, false)
      } catch (err) {
        throw err
      }
    }
  }
}
