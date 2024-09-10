import { ConfigError, InputError, ContractFunctionRevertedError } from '#error/index.js'

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

  test('ContractFunctionRevertedError ', () => {
    const errorMessage = 'execution reverted'
    const error = new ContractFunctionRevertedError(errorMessage)
    expect(error.message).toBe(`${prefix}${errorMessage}`)
  })
})
