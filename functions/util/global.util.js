// Packages
const admin = require('firebase-admin')
const configuration = require('@feathersjs/configuration')
const cors = require('cors')
const express = require('@feathersjs/express')
const feathers = require('@feathersjs/feathers')
const Joi = require('joi')
const { GeneralError, NotAuthenticated } = require('@feathersjs/errors')

// Credentials
const credentials = require('../credentials.firebase.json')

/**
 * @file Global utility functions
 * @module utilities/global
 * @author Lexus Drumgold <lex@lexusdrumgold.design>
 */

module.exports = {
  /**
   * Creates a new Feathers application.
   *
   * @param {Function} services - Callback fn to initialize services
   * @param {object} mixins - Object containing serivice mixins where the key
   * corresponds to a service name
   * @returns {feathers.Application}
   * @throws {GeneralError | NotAuthenticated}
   */
  configure_feathers: (services, mixins) => {
    try {
      // Create an app that is a Feathers AND Express application
      const application = express(feathers())

      // Load app configuration
      application.configure(configuration())

      const env = application.get('node_env')
      if (env !== 'production') {
        console.info(`Application initialized. Node environment -> ${env}.`)
      }

      // Enable CORS and body parsing
      application.use(cors())
      application.use(express.json())
      application.use(express.urlencoded({ extended: true }))

      // Set up Plugins and providers
      application.configure(express.rest())

      // Add mixins, must be added before services
      if (mixins) {
        application.mixins.push((service, path) => {
          const service_mixins = mixins[path]

          for (const fn in service_mixins) {
            service[fn] = service_mixins[fn]
          }
        })
      }

      // Set up our services
      if (services) application.configure(services)

      // Configure our error handler
      application.use(express.errorHandler((err, req, res, next) => {
        const { code, message, data } = err
        res.status(code).send({ status: code, message, data })
      }))

      return application
    } catch (err) {
      err.message = `Error initializing Feathers app -> ${err.message}`

      console.error(err)
      throw new GeneralError(err, { services, mixins })
    }
  },

  /**
   * Initializes a new Firebase Admin project.
   *
   * @returns {admin.app.App}
   */
  configure_firebase: () => {
    try {
      return admin.initializeApp({
        credential: admin.credential.cert(credentials),
        apiKey: 'AIzaSyCv9InTgqD-E9ZyvQevPobrybQ5Q4MMIwU',
        authDomain: 'chadnetworkbase.firebaseapp.com',
        databaseURL: 'https://chadnetworkbase.firebaseio.com',
        projectId: 'chadnetworkbase',
        storageBucket: 'chadnetworkbase.appspot.com',
        messagingSenderId: '544876102310',
        appId: '1:544876102310:web:6d45283722782e88'
      })
    } catch (err) {
      err.message = `Error initializing Firebase Admin -> ${err.message}`
      throw new NotAuthenticated(err.message)
    }
  },

  /**
   * Validates @see @param value against @see @param schema .
   *
   * @param {*} value - Value to check schema against
   * @param {Joi.Schema} schema - Joi schema
   * @param {object} options - Joi options
   * @returns {*} Validated value
   * @throws {BadRequest}
   */
  validate_schema: (value, schema, options) => {
    return Joi.validate(value, schema, options, (err, value) => {
      if (err) throw err
      return value
    })
  }
}
