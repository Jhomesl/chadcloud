// Global Utilities
const { feathers_error } = require('./error.util')

/**
 * @file Authentication service utilities
 *
 * @todo Implement recover_email, recover_password, and verify_email
 *
 * @module utilities/auth
 * @author Lexus Drumgold <lex@lexusdrumgold.design>
 */

module.exports = {
  /**
   * Verifies @see id_token. If @see uid is defined, the function will validate
   * the id_token against the uid.
   *
   * @async
   * @param {admin.auth.Auth} authentication - Firebase Auth interface
   * @param {string} id_token - User's Firebase id token
   * @param {string | undefined} uid - User's Firebase UID
   * @param {boolean} admin - If true, check if user is an admin.
   * @returns {Promise<object>} User record
   * @throws {NotAuthenticated}
   */
  authenticate: async (auth, id_token, uid = undefined, admin = false) => {
    const err_data = { id_token, uid }

    try {
      // Verify id token
      const decoded = await auth.verifyIdToken(id_token, true)

      // Match uid against decoded uid from id token
      if (uid && decoded.uid !== uid) {
        throw feathers_error('Id token does not match uid.', err_data, 401)
      }

      // Get authenticated user data
      const user = (await auth.getUser(decoded.uid)).toJSON()

      // Check if user is an admin
      if (uid && admin && !user.customClaims.admin) {
        throw feathers_error('User is not admin.', err_data, 401)
      }

      // If admin is false, return authenticated user data
      return user
    } catch (err) {
      const { code, message } = err

      err.message = `Error authenticating user -> ${message}`
      if (code) err.data.firebase_code = code

      throw err
    }
  },

  recover_email: async () => {

  },

  recover_password: async () => {

  },

  verify_email: async () => {

  }
}
