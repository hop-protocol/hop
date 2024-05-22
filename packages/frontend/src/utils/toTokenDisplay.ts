import { BigNumberish, utils } from 'ethers'
import { commafy } from '#utils/index.js'

export const toTokenDisplay = (num?: BigNumberish, decimals: number = 18, symbol?: string, significantDecimals?: number) => {
  if (!num || !decimals) {
    return '-'
  }

  const formattedNum = utils.formatUnits(num, decimals)
  const nonDecimalNum = formattedNum.split('.')[0]
  if (!significantDecimals) {
    significantDecimals = 0
  }
  if (nonDecimalNum.length < 8 && !significantDecimals) {
    significantDecimals = 8 - nonDecimalNum.length
  }

  let formatted = ''
  if (decimals <= 1) {
    formatted = commafy(num.toString(), significantDecimals)
  } else {
    formatted = commafy(utils.formatUnits(num, decimals), significantDecimals)
  }

  if (symbol) {
    formatted += ` ${symbol}`
  }

  return formatted
}
