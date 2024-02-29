import * as addresses from '#addresses/index.js'

test('addresses', () => {
  expect(addresses.mainnet.bridges!.USDC!.ethereum!.l1Bridge).toBeTruthy()
})
