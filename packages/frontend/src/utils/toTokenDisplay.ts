import { BigNumberish } from 'ethers'
import { commafy } from 'src/utils'
import { formatUnits } from 'ethers/lib/utils'

export const toTokenDisplay = (num?: BigNumberish, decimals: number = 18, symbol?: string, significantDecimals?: number) => {
  if (!num || !decimals) {
    return '-'
  }

  const formattedNum = formatUnits(num, decimals)
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
    formatted = commafy(formatUnits(num, decimals), significantDecimals)
  }

  if (symbol) {
    formatted += ` ${symbol}`
  }

  return formatted
}
