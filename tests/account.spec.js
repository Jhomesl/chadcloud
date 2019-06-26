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
      await service.create(Mock.data[2])
    } catch (err) {
      expect(err.name).toBe('BadRequest')
    }

    try {
      await service.create(Mock.data[7])
    } catch (err) {
      expect(err.name).toBe('BadRequest')
    }

    try {
      await service.create(Mock.data[8])
    } catch (err) {
      expect(err.name).toBe('BadRequest')
    }
  })

  it('Creates and deletes seven new accounts.', async () => {
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
          await service.remove(account.uid)
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
