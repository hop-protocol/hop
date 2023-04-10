import Chain from '../../src/models/Chain'
import { RelayerFee } from '../../src/relayerFee'

describe('RelayerFee', () => {
  it('Arbitrum relayer fee test', async () => {
    const relayerFee = new RelayerFee()
    const gasCost = await relayerFee.getRelayCost('mainnet', Chain.Arbitrum.slug, 'USDC')
    expect(gasCost).toBeTruthy()
  }, 60 * 1000)
})
