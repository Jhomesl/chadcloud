// Feathers application
const Feathers = require('../functions/feathers').accounts

// Mocks
const Mock = require('./__mocks__/Accounts.mock.json')

/**
 * @file Account Service unit tests
 * @author Lexus Drumgold <lex@lexusdrumgold.design>
 */

describe('Account service', () => {
  // Set up Feathers application
  Feathers.setup()

  // Get accounts service
  const service = Feathers.service('accounts')

  it('It does not create an account if the payload is invalid.', async () => {
    try {
      expect(await service.create()).toThrow()
      expect(await service.create(Mock.data[7])).toThrow()
      expect(await service.create(Mock.data[8])).toThrow()
    } catch (err) {
      expect(err.name).toBe('BadRequest')
    }
  })

  it('Creates and deletes eight accounts.', async () => {
    let created = []
    let rejected = 0

    return Promise.all(Mock.data.map(async account => {
      try {
        created.push(await service.create(account))
      } catch (err) {
        rejected++
      }
    })).then(completed => {
      console.info('Created users ->', created)

      let deleted = 0

      return Promise.all(created.map(async account => {
        try {
          // Because we validate our payload and query before authenticating,
          // a query must be present. The id_token itself doesn't matter
          await service.remove(account.uid, { query: { id_token: 'server' } })
          deleted++
        } catch (err) {
          console.error('Error deleting account ->', err)
        }
      })).then(completed => {
        expect(created.length).toBe(Mock.options.count.valid)
        expect(rejected).toBe(Mock.options.count.invalid)
        expect(deleted).toBe(Mock.options.count.valid)
      })
    })
  })
})
