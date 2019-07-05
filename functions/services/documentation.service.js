// Hooks
const hooks = require('../hooks/documentation.hooks')

/**
 * Generates API documentation.
 *
 * @class Documentation
 * @author Lexus Drumgold <lex@lexusdrumgold.design>
 */
class Documentation {
  /**
   * Special service initialization method.
   *
   * @param {Feathers.Application} app - Feathers application
   * @param {string} path - /docs
   * @returns {Documentation}
   */
  setup(app, path) {
    this.app = app
    this.path = path

    // Node environment
    this.environment = this.app.get('node_env')

    if (this.environment === 'development') {
      const url = `http://localhost:${this.app.get('ports').documentation}`
      console.info(`Initialized Documentation service on ${url}/${path}.`)
    }
  }

  /**
   * Retreives the API documentation.
   *
   * @param {object} params - Additional information for the service method
   * @param {object} params.query - Query options
   * @returns {Promise<object>} API documentation
   */
  async find(params) {
    return { message: 'Chad Cloud documentation in progress 😎💬' }
  }
}

module.exports = app => {
  const { docs } = app.get('routes')

  // Initialize route and add hooks
  app.use(docs, new Documentation())
  app.service(docs).hooks(hooks)
}
