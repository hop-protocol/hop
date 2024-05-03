import * as addresses from '#addresses/index.js'

test('addresses', () => {
  expect(addresses.mainnet.bridges.ETH!.ethereum!.l1Bridge).toBeTruthy()
})
