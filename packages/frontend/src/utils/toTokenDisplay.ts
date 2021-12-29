import { BigNumberish } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { commafy } from 'src/utils'

export const toTokenDisplay = (num?: BigNumberish, decimals: number = 18, symbol?: string) => {
  if (!num || !decimals) {
    return '-'
  }

  const formattedNum = formatUnits(num, decimals)
  const nonDecimalNum = formattedNum.split('.')[0]
  let significantDecimals = 0
  if (nonDecimalNum.length < 8) {
    significantDecimals = 8 - nonDecimalNum.length
  }

  let formatted = commafy(formatUnits(num, decimals), significantDecimals)

  if (symbol) {
    formatted += ` ${symbol}`
  }

  return formatted
}
