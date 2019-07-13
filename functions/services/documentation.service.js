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

    if (app.get('node_env') === 'development') {
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
