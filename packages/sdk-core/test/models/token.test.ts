import Token from '../../src/models/Token'

test.skip('token', () => {
  const token = new Token(
    42,
    '0x7d669A64deb8a4A51eEa755bb0E19FD39CE25Ae9',
    18,
    'DAI',
    'Testnet DAI'
  )
  expect(token.chainId).toBe(42)
  expect(token.address).toBe('0x7d669A64deb8a4A51eEa755bb0E19FD39CE25Ae9')
  expect(token.symbol).toBe('DAI')
  expect(token.decimals).toBe(18)
  expect(token.name).toBe('Testnet DAI')
})
