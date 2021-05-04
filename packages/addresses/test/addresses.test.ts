import * as addresses from '../src'

test('addresses', () => {
  expect(addresses.kovan.USDC.ethereum.l1Bridge).toBeTruthy()
})
