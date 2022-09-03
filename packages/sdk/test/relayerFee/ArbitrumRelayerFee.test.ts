import Chain from '../../src/models/Chain'
import { RelayerFee } from '../../src/relayerFee'

describe('RelayerFee', () => {
  it('test ', async () => {
    const relayerFee = new RelayerFee('mainnet', 'USDC')
    const relayCost = await relayerFee.getRelayCost(Chain.Arbitrum.slug)
    expect(relayCost).toBeTruthy()
  }, 60 * 1000)
})
