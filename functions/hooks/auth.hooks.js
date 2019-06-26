/**
 * @file Authentication service hooks
 *
 * @todo Add documentation
 *
 * @module hooks/authentication
 * @author Lexus Drumgold <lex@lexusdrumgold.design>
 */

module.exports = {
  before: {
    create: async context => {
      const utilities = context.app.get('utilities')
      const { authenticate } = utilities.context

      try {
        return await authenticate(context, false)
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
