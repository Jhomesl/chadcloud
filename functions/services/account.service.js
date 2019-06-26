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
   * @param {Feathers.Application} app - Feathers application
   * @param {string} path - Name of Firebase database
   * @returns {undefined}
   */
  setup(app, path) {
    this.app = app
    this.path = path

    // Firebase Authentication interface
    this.authentication = this.app.get('firebase/admin').auth()

    // Utilities
    this.utilities = this.app.get('utilities')

    // Node environment
    this.environment = this.app.get('node_env')

    if (this.environment === 'development') {
      console.info(`Initialized Account service on path /${path}.`)
    }
  }

  /**
   * Creates a new account using email and password. @see data.uid will be used
   * as the user's username. The user will be disabled until they verify their
   * email address.
   *
   * @async
   * @param {admin.auth.CreateRequest} data - New account data
   * @param {string} data.displayName - The user's display name
   * @param {string} data.email - The user's email address
   * @param {string} data.password - The user's account password
   * @param {string | null} data.photoURL - The user's photo url
   * @param {string} data.uid - Username
   * @param {object} params - Additional information for the service method
   * @param {object} params.query - Query parameters
   * @returns {Promise<object>} New user record
   * @throws {BadRequest}
   */
  async create(data, params) {
    // ! New user will be disabled until they verify their email
    data.disabled = true
    data.emailVerified = false
    data.photoURL = data.photoURL && data.photoURL.length
      ? data.photoURL : `https://api.adorable.io/avatars/285/${data.uid}`

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
   * @param {object} params.query.id_token - Admin user's Firebase id token
   * @param {object} params.user - Authenticated user
   * @param {object} params.user.uid - Authenticated user's uid
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
   * @param {boolean} data.premium - True if user is premium user
   * @param {string} data.type - Account type. BUSINESS | PERSONAL
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
