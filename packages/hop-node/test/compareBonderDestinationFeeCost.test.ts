import { BigNumber } from 'ethers'
import { compareBonderDestinationFeeCost } from 'src/watchers/classes/Bridge'
import { setConfigByNetwork } from 'src/config'

setConfigByNetwork('mainnet')

describe('compareBonderDestinationFeeCost', () => {
  // tx: 0xfae2cf947903b6eb7eac6703f1486fefa551418a4ad11a575e9b985062da8293
  it('to not throw', async () => {
    const bonderFee = BigNumber.from('99557061') // 99.557061
    const gasLimit = BigNumber.from('157912')
    const tokenSymbol = 'USDC'
    const chain = 'ethereum'

    let threw = false
    try {
      await compareBonderDestinationFeeCost(bonderFee, gasLimit, chain, tokenSymbol)
    } catch (err) {
      threw = true
    }
    expect(threw).toBeFalsy()
  }, 10 * 1000)

  it('to throw if too low', async () => {
    const bonderFee = BigNumber.from('30000000') // 30
    const gasLimit = BigNumber.from('157912')
    const tokenSymbol = 'USDC'
    const chain = 'ethereum'

    let threw = false
    try {
      await compareBonderDestinationFeeCost(bonderFee, gasLimit, chain, tokenSymbol)
    } catch (err) {
      threw = true
    }
    expect(threw).toBeTruthy()
  }, 10 * 1000)
})
