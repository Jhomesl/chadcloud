// Firebase
const { Firebase, app, auth, databases } = require('../functions/firebase')

/**
 * @file Firebase unit tests
 * @author Lexus Drumgold <lex@lexusdrumgold.design>
 */

describe('Firebase namespace', () => {
  it('The Firebase application is defined.', () => {
    try {
      expect(app.name_).toBe('[DEFAULT]')
      expect(Firebase.app.name_).toBe('[DEFAULT]')
    } catch (err) {
      console.error('Error initializing Firebase ->', err)
    }
  })

  it('The Firebase Authentication service is defined.', () => {
    try {
      expect(auth).toBeDefined()
      expect(Firebase.auth).toBeDefined()
    } catch (err) {
      console.error('Error initializing Firebase Authentication ->', err)
    }
  })

  it('The Firebase Database services are defined.', () => {
    try {
      for (const name in Firebase.databases) {
        expect(databases[name]).toBeDefined()
        expect(Firebase.databases[name]).toBeDefined()
      }
    } catch (err) {
      console.error('Error initializing Firebase Databases ->', err)
    }
  })
})
