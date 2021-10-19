/*
import { BigNumber } from 'ethers'
import { compareBonderDestinationFeeCost } from 'src/watchers/classes/Bridge'
import { parseUnits } from 'ethers/lib/utils'
import { setConfigByNetwork } from 'src/config'

setConfigByNetwork('mainnet')

describe('compareBonderDestinationFeeCost', () => {
  // tx: 0xfae2cf947903b6eb7eac6703f1486fefa551418a4ad11a575e9b985062da8293
  it('to not throw', async () => {
    const bonderFee = BigNumber.from('99557061') // 99.557061
    const gasLimit = BigNumber.from('157912')
    const tokenSymbol = 'USDC'
    const chain = 'ethereum'
    const gasPrice = parseUnits('122', 9)

    let threw = false
    try {
      await compareBonderDestinationFeeCost(bonderFee, gasLimit, chain, tokenSymbol, gasPrice)
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
    const gasPrice = parseUnits('122', 9)

    let threw = false
    try {
      await compareBonderDestinationFeeCost(bonderFee, gasLimit, chain, tokenSymbol, gasPrice)
    } catch (err) {
      threw = true
    }
    expect(threw).toBeTruthy()
  }, 10 * 1000)

  it('to throw if too low', async () => {
    // arbitrum->polygon
    // transferId: 0xba44237b31162611c8abb131ecfce3b6d9842551317c11bd0db3787e3bbdbf2b
    // error: "bonder fee is too low. Cannot bond withdrawal. bonderFee: 1.000123, gasCost: 2.733330070753149124"
    const bonderFee = BigNumber.from('1000123') // 1.000123
    const gasLimit = BigNumber.from('1000000')
    const tokenSymbol = 'USDC'
    const chain = 'polygon'
    const gasPrice = BigNumber.from('0x3b9aca01')
    const tokenUsdPrice = 1
    // const chainNativeTokenUsdPrice = 1.25 // MATIC
    const chainNativeTokenUsdPrice = 3200 // ETH

    let threw = false
    try {
      await compareBonderDestinationFeeCost(bonderFee, gasLimit, chain, tokenSymbol, gasPrice, tokenUsdPrice, chainNativeTokenUsdPrice)
    } catch (err) {
      threw = true
    }
    expect(threw).toBeTruthy()
  }, 10 * 1000)
})
*/
