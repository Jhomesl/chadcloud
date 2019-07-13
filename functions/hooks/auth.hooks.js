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
    remove: async context => {
      const { authenticate } = context.app.get('utilities').context

      try {
        return await authenticate(context, false)
      } catch (err) {
        throw err
      }
    }
  }
}
