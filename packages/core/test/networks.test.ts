import * as networks from '../src/networks'

test('networks', () => {
  expect(networks.mainnet.polygon!.publicRpcUrl).toBe('https://polygon-rpc.com')
})
