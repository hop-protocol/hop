import { BigNumber } from 'ethers'
import { checkMinBonderFee } from 'src/watchers/classes/Bridge'
import { parseUnits } from 'ethers/lib/utils'
import { setConfigByNetwork } from 'src/config'

setConfigByNetwork('mainnet')

describe('checkMinBonderFee', () => {
  // tx: 0xfae2cf947903b6eb7eac6703f1486fefa551418a4ad11a575e9b985062da8293
  it('to not throw', async () => {
    const amountIn = BigNumber.from('1052640417') // 1052.640417
    const bonderFee = BigNumber.from('99557061') // 99.557061
    const gasLimit = BigNumber.from('157912')
    const tokenSymbol = 'USDC'
    const chain = 'ethereum'
    const gasPrice = parseUnits('122', 9)

    let threw = false
    try {
      await checkMinBonderFee(amountIn, bonderFee, gasLimit, chain, tokenSymbol, gasPrice)
    } catch (err) {
      threw = true
    }
    expect(threw).toBeFalsy()
  }, 10 * 1000)

  it('to throw if too low', async () => {
    const amountIn = BigNumber.from('5081424814') // 5081.424814
    const bonderFee = BigNumber.from('30000000') // 30
    const gasLimit = BigNumber.from('157912')
    const tokenSymbol = 'USDC'
    const chain = 'ethereum'
    const gasPrice = parseUnits('122', 9)

    let threw = false
    try {
      await checkMinBonderFee(amountIn, bonderFee, gasLimit, chain, tokenSymbol, gasPrice)
    } catch (err) {
      threw = true
    }
    expect(threw).toBeTruthy()
  }, 10 * 1000)
})
