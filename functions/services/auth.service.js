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
   * Special service initialization method.
   *
   * For services registered before app.listen is invoked, the setup function of
   * each registered service is called on invoking app.listen. For services
   * registered after app.listen is invoked, setup is called automatically by
   * Feathers when a service is registered.
   *
   * setup is a great place to initialize your service with any special
   * configuration or if connecting services that are very tightly coupled.
   *
   * @see {@link https://docs.feathersjs.com/api/services.html#setupapp-path}
   *
   * @param {Feathers.Application} app - Feathers application
   * @param {string} path - Path service was registered on without the '/'
   * @returns {Promise}
   */
  setup(app, path) {
    /**
     * @property {feathers.Application} app - Current Feathers application
     * @instance
     */
    this.app = app

    /**
     * @property {string} path - Path service was registered on without the '/'
     * @instance
     */
    this.path = path

    /**
     * @property {firebase.auth.Auth} authentication - Firebase Auth interface
     * @instance
     */
    this.authentication = this.app.get('firebase/admin').auth()

    /**
     * @property {object} utilities - Utility functions
     * @instance
     */
    this.utilities = this.app.get('utilities')

    if (this.app.get('node_env') === 'development') {
      const url = `http://localhost:${this.app.get('ports').authentication}`
      console.info(`Initialized Authentication service on ${url}/${path}.`)
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
   * @returns {Promise<boolean>}
   * @throws {NotAuthenticated}
   */
  async find(params) {
    const {
      recover_email, recover_password, verify_email
    } = this.utilities.auth

    try {
      const { mode, actionCode, continueUrl, lang } = params.query
      const request = [this.app, { actionCode, continueUrl, lang }]

      // Handle user management action
      if (mode === 'recoverEmail') return await recover_email(...request)
      if (mode === 'resetPassword') return await recover_password(...request)
      if (mode === 'verifyEmail') return await verify_email(...request)

      return true
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
