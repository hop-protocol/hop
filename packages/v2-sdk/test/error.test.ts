import { ConfigError, InputError } from '#error/index.js'

describe('Custom Error Classes', () => {
  const prefix = 'HopV2Sdk: '

  test('ConfigError should include the prefix', () => {
    const errorMessage = 'Invalid configuration'
    const error = new ConfigError(errorMessage)
    expect(error.message).toBe(`${prefix}${errorMessage}`)
  })

  test('InputError should include the prefix', () => {
    const errorMessage = 'Invalid input'
    const error = new InputError(errorMessage)
    expect(error.message).toBe(`${prefix}${errorMessage}`)
  })
})
