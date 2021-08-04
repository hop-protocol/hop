import * as addresses from '../src/addresses'

test('addresses', () => {
  expect(addresses.kovan.bridges.USDC.ethereum.l1Bridge).toBeTruthy()
})
