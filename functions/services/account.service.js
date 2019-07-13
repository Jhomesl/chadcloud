// Hooks
const hooks = require('../hooks/account.hooks')

/**
 * Service for creating and deleting user accounts, as well as interacting with
 * privileged user data.
 *
 * @class Account
 * @author Lexus Drumgold <lex@lexusdrumgold.design>
 */
class Account {
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
      const url = `http://localhost:${this.app.get('ports').accounts}`
      console.info(`Initialized Account service on ${url}/${path}.`)
    }
  }

  /**
   * Creates a new account via email/password.
   *
   * @async
   * @param {admin.auth.CreateRequest} data - New account data
   * @param {string} data.displayName - The user's display name
   * @param {string} data.email - The user's email address
   * @param {string} data.password - The user's account password
   * @param {string | null} data.photoURL - The user's photo url
   * @param {object} params - Additional information for the service method
   * @returns {Promise<object>} New user record
   * @throws {BadRequest}
   */
  async create(data, params) {
    /**
     * In production, the user will be disabled until they verify their email
     * address. For testing purpose, this property must be dependent upon the
     * current Node environment.
     *
     * The emailVerified property will be defined as expected.
     */
    data.disabled = this.app.get('node_env') === 'production'
    data.emailVerified = false

    if (!data.photoURL) {
      const name = data.displayName.replace(' ', '%20')
      data.photoURL = `https://api.adorable.io/avatars/285/${name}`
    }

    try {
      return (await this.authentication.createUser(data)).toJSON()
    } catch (err) {
      let { code, message } = err
      const { feathers_error, method_preview } = this.utilities.error

      // Transform Firebase error
      const err_method = method_preview('Account#create', { data, params })
      const details = { firebase_code: code, method: err_method, errors: {} }

      const { displayName, email, password, phoneNumber, photoURL, uid } = data

      // Get data that caused error
      switch (code) {
        case 'auth/invalid-display-name':
          details.errors.displayName = displayName
          break
        case 'auth/invalid-email':
        case 'auth/email-already-exists':
          details.errors.email = email
          break
        case 'auth/invalid-password':
          details.errors.password = password
          break
        case 'auth/invalid-phone-number':
        case 'auth/phone-number-already-exists':
          details.errors.phoneNumber = phoneNumber
          break
        case 'auth/invalid-photo-url':
          details.errors.photoURL = photoURL
          break
        case 'auth/uid-already-exists':
          details.errors.username = uid
          message = 'Username unavailable.'
          break
        default:
          details.errors = undefined
          break
      }

      throw feathers_error(`Error creating account -> ${message}`, details, 400)
    }
  }

  /**
   * Retreives all users, or retreives a user by email.
   *
   * @async
   * @param {object} params - Additional information for the service method
   * @param {object} params.query - Query parameters
   * @param {string} params.query.id_token - Admin user's Firebase id token
   * @param {object} params.query.page - Next page token if listing users
   * @param {number} params.query.results - Max number of user results
   * @param {object} params.user - Authenticated user
   * @param {string} params.user.uid - Authenticated user's uid
   * @returns {Promise<admin.auth.ListUsersResult | object>} Object containing
   * list of users or Firebase user record
   * @throws {NotFound}
   */
  async find(params) {
    const { email, page, results } = params.query

    try {
      if (email) {
        return (await this.authentication.getUserByEmail(email)).toJSON()
      }

      return await this.authentication.listUsers(results, page)
    } catch (err) {
      const { code, message } = err
      const { feathers_error, method_preview } = this.utilities.error

      // Transform and throw Firebase error
      const err_method = method_preview('User#find', { params })
      const details = { firebase_code: code, method: err_method }

      throw feathers_error(`Error getting users -> ${message}`, details, 404)
    }
  }

  /**
   * Retreives a Firebase user record.
   *
   * @async
   * @param {string} id - Username
   * @param {object} params - Additional information for the service method
   * @param {object} params.query - Query parameters
   * @param {object} params.query.id_token - User's Firebase id token
   * @param {object} params.user - Authenticated user
   * @returns {Promise<object>} User record
   * @throws {NotFound}
   */
  async get(id, params) {
    try {
      return (await this.authentication.getUser(id)).toJSON()
    } catch (err) {
      const { code, message } = err
      const { feathers_error, method_preview } = this.utilities.error

      // Transform and throw Firebase error
      const err_method = method_preview('Account#get', { id, params })
      const details = { firebase_code: code, method: err_method }

      throw feathers_error(`Error getting account -> ${message}`, details, 404)
    }
  }

  /**
   * Patches a user's custom claims.
   * Other existing custom claims will be merged with the new custom claims.
   *
   * @async
   * @param {string} id - Username
   * @param {object} data - New custom claim data
   * @param {string} data.birthday - User birthday in ISO 8601 date format
   * @param {boolean} data.business - True if business account
   * @param {boolean} data.premium - True if user is a premium user
   * @param {object} params - Additional information for the service method
   * @param {object} params.query - Query parameters
   * @param {object} params.query.id_token - User's Firebase id token
   * @param {object} params.user - Authenticated user
   * @returns {Promise<object>} Updated custom claims
   * @throws {GeneralError}
   */
  async patch(id, data, params) {
    const { customClaims, uid } = params.user

    try {
      // Update custom claims
      const claims = { ...customClaims, ...data }
      await this.authentication.setCustomUserClaims(uid, claims)

      return claims
    } catch (err) {
      const { code, data, message } = err
      const { feathers_error, method_preview } = this.utilities.error

      // Transform and throw error
      const err_method = method_preview('Account#patch', { id, data, params })
      const details = { firebase_code: code, method: err_method }

      throw feathers_error(`Error patching user claims -> ${message}`, details)
    }
  }

  /**
   * Updates a user's account.
   *
   * @async
   * @param {string} id - Username
   * @param {admin.auth.UpdateRequest} data - Patch data
   * @param {string} data.displayName - The user's display name
   * @param {string} data.email - The user's email address
   * @param {string} data.password - The user's account password
   * @param {string} data.photoURL - The user's photo url
   * @param {object} params - Additional information for the service method
   * @param {object} params.query - Query parameters
   * @param {string} params.query.id_token - User's Firebase id token
   * @param {object} params.user - Authenticated user
   * @returns {Promise<object>} Updated user record
   * @throws {GeneralError}
   */
  async update(id, data, params) {
    try {
      return (await this.authentication.updateUser(id, data)).toJSON()

      // TODO: Update emailVerified prop if email was successfully updated
      // TODO: Send email verification after updating emailVerified
    } catch (err) {
      const { code, message } = err
      const { feathers_error, method_preview } = this.utilities.error

      // Transform and throw Firebase error
      const err_method = method_preview('Account#update', { id, data, params })
      const details = { firebase_code: code, method: err_method }

      throw feathers_error(`Error updating account -> ${message}`, details)
    }
  }

  /**
   * Removes a user account.
   *
   * ! Firebase Auth trigger will handle user deletion cleanup.
   * @see @module users/functions
   *
   * @async
   * @param {string} id - Username
   * @param {object} params - Additional information for the service method
   * @param {object} params.query - Query parameters
   * @param {object} params.query.id_token - User's Firebase id token
   * @param {object} params.user - Authenticated user
   * @returns {Promise<string>} Username
   * @throws {GeneralError}
   */
  async remove(id, params) {
    try {
      await this.authentication.deleteUser(id)
      return id
    } catch (err) {
      const { code, message } = err
      const { feathers_error, method_preview } = this.utilities.error

      // Transform and throw Firebase error
      const err_method = method_preview('Account#remove', { id, params })
      const details = { firebase_code: code, method: err_method }

      throw feathers_error(`Error removing account -> ${message}`, details)
    }
  }
}

module.exports = app => {
  const { accounts } = app.get('routes')

  // Initialize route and add hooks
  app.use(accounts, new Account())
  app.service(accounts).hooks(hooks)
}
