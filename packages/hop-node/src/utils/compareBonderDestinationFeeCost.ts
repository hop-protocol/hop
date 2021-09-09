import getBumpedGasPrice from 'src/utils/getBumpedGasPrice'
import getRpcProvider from 'src/utils/getRpcProvider'
import getTokenDecimals from 'src/utils/getTokenDecimals'
import shiftBNDecimals from 'src/utils/shiftBNDecimals'
import { BigNumber } from 'ethers'
import { BonderFeeTooLowError } from 'src/types/error'
import { GAS_PRICE_MULTIPLIER } from 'src/constants'
import { PriceFeed } from 'src/priceFeed'
import { formatUnits, parseUnits } from 'ethers/lib/utils'

const priceFeed = new PriceFeed()

async function compareBonderDestinationFeeCost (
  bonderFee: BigNumber,
  gasLimit: BigNumber,
  chain: string,
  tokenSymbol: string
) {
  const ethDecimals = 18
  const gweiDecimals = 9
  const provider = getRpcProvider(chain)
  const gasPrice = getBumpedGasPrice(await provider.getGasPrice(), GAS_PRICE_MULTIPLIER)
  const gasPrice18d = shiftBNDecimals(gasPrice, ethDecimals - gweiDecimals)
  const gasCost = gasLimit.mul(gasPrice)
  const ethUsdPrice = await priceFeed.getPriceByTokenSymbol('ETH')
  const tokenUsdPrice = await priceFeed.getPriceByTokenSymbol(tokenSymbol)
  const tokenUsdPriceBn = parseUnits(tokenUsdPrice.toString(), ethDecimals)
  const ethUsdPriceBn = parseUnits(ethUsdPrice.toString(), ethDecimals)
  const tokenDecimals = getTokenDecimals(tokenSymbol)
  const bonderFee18d = shiftBNDecimals(bonderFee, ethDecimals - tokenDecimals)
  const usdBonderFee = bonderFee18d
  const oneEth = parseUnits('1', ethDecimals)
  const usdGasCost = gasCost.mul(ethUsdPriceBn).div(oneEth)
  const usdBonderFeeFormatted = formatUnits(usdBonderFee, ethDecimals)
  const usdGasCostFormatted = formatUnits(usdGasCost, ethDecimals)
  const isTooLow = bonderFee.eq(0) || usdBonderFee.lt(usdGasCost.div(2))
  if (isTooLow) {
    throw new BonderFeeTooLowError(`bonder fee is too low. Cannot bond withdrawal. bonderFee: ${usdBonderFeeFormatted}, gasCost: ${usdGasCostFormatted}`)
  }
}

export default compareBonderDestinationFeeCost
