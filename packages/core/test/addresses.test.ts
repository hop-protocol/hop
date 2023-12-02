import * as addresses from '../src/addresses'

test('addresses', () => {
  expect(addresses.mainnet.bridges!.USDC!.ethereum!.l1Bridge).toBeTruthy()
})
