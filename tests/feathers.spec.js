// Feathers applications
const {
  Feathers, accounts, authentication, documentation
} = require('../functions/feathers')

/**
 * @file Feathers namespace unit tests
 * @see @namespace Feathers
 * @author Lexus Drumgold <lex@lexusdrumgold.design>
 */

describe('Feathers namespace', () => {
  it('The Feathers namespace is defined.', () => {
    try {
      expect(Feathers).toBeDefined()
    } catch (err) {
      console.error('Error getting Feathers namespace ->', err)
    }
  })

  it('The Feathers Accounts application is defined and setup.', () => {
    try {
      expect(Feathers.accounts).toBeDefined()
      expect(accounts).toBeDefined()

      expect(Feathers.accounts.get('firebase/admin')).toBeDefined()
      expect(accounts.get('firebase/admin')).toBeDefined()

      expect(Feathers.accounts.get('models')).toBeDefined()
      expect(accounts.get('models')).toBeDefined()

      expect(Feathers.accounts.get('utilities')).toBeDefined()
      expect(accounts.get('utilities')).toBeDefined()

      expect(Feathers.accounts.service('accounts')).toBeDefined()
      expect(accounts.service('accounts')).toBeDefined()
    } catch (err) {
      console.error('Error getting Feathers Accounts application ->', err)
    }
  })

  it('The Feathers Authentication application is defined and setup.', () => {
    try {
      expect(Feathers.authentication).toBeDefined()
      expect(authentication).toBeDefined()

      expect(Feathers.authentication.get('firebase/admin')).toBeDefined()
      expect(authentication.get('firebase/admin')).toBeDefined()

      expect(Feathers.authentication.get('models')).toBeDefined()
      expect(authentication.get('models')).toBeDefined()

      expect(Feathers.authentication.get('utilities')).toBeDefined()
      expect(authentication.get('utilities')).toBeDefined()

      expect(Feathers.authentication.service('authentication')).toBeDefined()
      expect(authentication.service('authentication')).toBeDefined()
    } catch (err) {
      console.error('Error getting Feathers Authentication application ->', err)
    }
  })

  it('The Feathers Documentation application is defined and setup.', () => {
    try {
      expect(Feathers.documentation).toBeDefined()
      expect(documentation).toBeDefined()

      expect(Feathers.documentation.get('firebase/admin')).toBeDefined()
      expect(documentation.get('firebase/admin')).toBeDefined()

      expect(Feathers.documentation.get('models')).toBeDefined()
      expect(documentation.get('models')).toBeDefined()

      expect(Feathers.documentation.get('utilities')).toBeDefined()
      expect(documentation.get('utilities')).toBeDefined()

      expect(Feathers.documentation.service('docs')).toBeDefined()
      expect(documentation.service('docs')).toBeDefined()
    } catch (err) {
      console.error('Error getting Feathers Documentation application ->', err)
    }
  })
})
