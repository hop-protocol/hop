import * as networks from '#networks/index.js'

test('networks', () => {
  expect(networks.mainnet.polygon!.publicRpcUrl).toBe('https://polygon-rpc.com')
})
