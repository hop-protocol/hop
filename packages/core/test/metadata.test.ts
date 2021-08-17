import * as metadata from '../src/metadata'

test('tokens', () => {
  expect(metadata.mainnet.tokens.USDC.decimals).toBe(6)
  //expect(metadata.kovan.tokens.USDC.decimals).toBe(18)
  expect(metadata.kovan.tokens.USDC.symbol).toBe('USDC')
  expect(metadata.kovan.tokens.USDC.name).toBe('USD Coin')
})

test('chains', () => {
  expect(metadata.chains.ethereum.name).toBe('Ethereum')
})
