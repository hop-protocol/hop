import * as networks from '../src/networks'

test('networks', () => {
  expect(networks.mainnet.gnosis.publicRpcUrl).toBe('https://rpc.gnosischain.com/')
})
