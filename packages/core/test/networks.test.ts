import * as networks from '../src/networks'

test('networks', () => {
  expect(networks.mainnet.xdai.publicRpcUrl).toBe('https://rpc.xdaichain.com')
})
