// import wallets from 'src/wallets'
import getRpcProvider from 'src/utils/getRpcProvider'
import RelayerFee from 'src/relayerFee/RelayerFee'
import { Chain } from 'src/constants'

describe('RelayerFee', () => {
  it('test ', async () => {
    const relayerFee = new RelayerFee()
    const relayCost = await relayerFee.getRelayCost(Chain.Arbitrum)
    expect(relayCost).toBeTruthy()

  }, 60 * 1000)
})
