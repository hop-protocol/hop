import * as networks from '../src'

test('networks', () => {
  expect(networks.mainnet.xdai.rpcUrls[0]).toBe('https://rpc.xdaichain.com')
})
