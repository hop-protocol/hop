import * as networks from '../src/networks'

test('networks', () => {
  expect(networks.mainnet.xdai.rpcUrls[0]).toBe('https://xdai.rpc.hop.exchange')
})
