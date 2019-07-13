/**
 * Generates Chad Cloud API documentation.
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

module.exports = app => app.use(app.get('routes').docs, new Documentation())
