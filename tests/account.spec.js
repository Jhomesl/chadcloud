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

  let tests = 'It does not create an account if the payload is invalid.'
  it(tests, async () => {
    try {
      expect(await service.create()).toThrow()
      expect(await service.create(Mock.data[7])).toThrow()
      expect(await service.create(Mock.data[8])).toThrow()
    } catch (err) {
      expect(err.name).toBe('BadRequest')
    }
  })

  tests = 'Creates eight accounts that can be found by email and deletes them.'
  it(tests, async () => {
    const created = []
    let rejected = 0

    return Promise.all(Mock.data.map(async account => {
      try {
        created.push(await service.create(account))
      } catch (err) {
        rejected++
      }
    })).then(async completed => {
      expect(rejected).toBe(Mock.options.count.invalid)

      /**
       * Because we validate our payload and query before authenticating,
       * a query must be present when making requests. In this context, the
       * value of @see query.id_token does not matter.
       */
      const query = { id_token: 'server' }

      let list = await service.find({ query })
      expect(list.users.length).toBe(Mock.options.count.valid)

      const found_by_email = []

      return Promise.all(created.map(async account => {
        try {
          // Verify we can get the user by their email address
          const find_by_email = { ...query, email: account.email }

          found_by_email.push(await service.find({ query: find_by_email }))

          try {
            await service.remove(account.uid, { query })
          } catch (err) {
            console.error('Error deleting account ->', err)
          }
        } catch (err) {
          console.error('Error getting user by email ->', err)
        }
      })).then(async completed => {
        expect(found_by_email.length).toBe(list.users.length)

        list = await service.find({ query })
        expect(list.users.length).toBeFalsy()
      })
    })
  })
})
