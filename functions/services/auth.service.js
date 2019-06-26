// Hooks
const hooks = require('../hooks/auth.hooks')

/**
 * Authentication service.
 *
 * Generate a custom login token for a user, handle email and password changes,
 * and revoke id tokens for a user.
 *
 * @class Authentication
 * @author Lexus Drumgold <lex@lexusdrumgold.design>
 */
class Authentication {
  /**
   * Initializes the Authentication service.
   *
   * @param {Feathers.Application} app - Feathers application
   * @param {string} path - Name of Firebase database
   * @returns {Authentication}
   */
  setup(app, path) {
    this.app = app
    this.path = path

    // Firebase Authentication interface
    this.authentication = app.get('firebase/admin').auth()

    // API key
    this.api_key = this.app.get('firebase').apiKey

    // Utilities
    this.utilities = app.get('utilities')

    if (this.app.get('environment') !== 'production') {
      console.info(`Initialized Authentication service on path /${path}.`)
    }
  }

  /**
   * Generates a custom token for the user associated with @see @param data .
   *
   * @async
   * @param {string} data - UID of user to create custom token for
   * @param {object} params.query - Query parameters
   * @param {object} params.query.token  - Firebase id token of user to generate
   * custom login token for
   * @param {string} params.user.uid - If defined, a custom login token will be
   * created for the user.
   * @returns {Promise<object>}
   * @throws {NotAuthenticated}
   */
  async create(data, params) {
    const { create_custom_token } = this.utilities.authentication

    try {
      return await create_custom_token(this.authentication, params.user.uid)
    } catch (err) {
      throw err
    }
  }

  /**
   * Handler for a email or password change.
   *
   * @async
   * @param {object} params - Additional information for the service method
   * @param {object} params.query - Query parameters
   * @param {string} params.query.apiKey -  Firebase project's API key
   * @param {string} params.query.oobCode - One-time code, used to identify and
   * verify a request
   * @param {string} params.query.lang - Optional BCP47 language tag
   * representing the user's locale. Use this value to provide localized email
   * action handler pages to your users
   * @param {string} params.query.mode - The user management action to be
   * completed. resetPassword | recoverEmail | verifyEmail
   * @returns {Promise<string>} Custom login token
   * @throws {NotAuthenticated}
   */
  async find(params) {
    const {
      recover_email, recover_password, verify_email
    } = this.utilities.authentication

    try {
      const { mode, actionCode, continueUrl, lang } = params.query
      const request = [this.app, { actionCode, continueUrl, lang }]

      // Handle user management action
      if (mode === 'recoverEmail') return await recover_email(...request)
      if (mode === 'resetPassword') return await recover_password(...request)
      if (mode === 'verifyEmail') return await verify_email(...request)
    } catch (err) {
      throw err
    }
  }

  /**
   * Revokes all refresh tokens for a user.
   *
   * @async
   * @param {string} id - Firebase UID of user to remove tokens from
   * @param {object} params - Additional information for the service method
   * @param {object} params.user - Authenticated user
   * @param {object} params.user.uid - Authenticated user's uid
   * @param {object} params.query - Query parameters
   * @param {object} params.query.token - Admin user's Firebase id token
   * @returns {Promise<boolean>} True if removed
   * @throws {GeneralError}
   */
  async remove(id, params) {
    try {
      await this.authentication.revokeRefreshTokens(params.user.uid)
      return true
    } catch (err) {
      let { code, message } = err

      err.message = `Error revoking #${id}'s refresh tokens -> ${message}`
      throw this.utilities.error.feathers_error(err, {
        firebase_code: code,
        method: { name: 'Authentication#remove', arguments: { id, params } }
      }, 400)
    }
  }
}

module.exports = app => {
  const { authentication } = app.get('routes')

  // Initialize route and add hooks
  app.use(authentication, new Authentication())
  app.service(authentication).hooks(hooks)
}
