import { getToken } from '#index.js'

describe('SDK', () => {
  test('getToken() should return a token by symbol', () => {
    const token = getToken('ETH')
    
    expect(token).toBeDefined()
    expect(token.symbol).toBe('ETH')
    expect(token.name).toBe('Ethereum')
    expect(token.decimals).toBe(18)
    expect(token.isStableCoin).toBe(false)
  })
})

