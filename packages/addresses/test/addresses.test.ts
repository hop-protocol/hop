import * as addresses from '../src'

test('addresses', () => {
  expect(addresses.kovan.bridges.USDC.ethereum.l1Bridge).toBeTruthy()
})
