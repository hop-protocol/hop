import { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'

export function toUsdDisplay(amount?: BigNumber, tokenDecimals?: number, tokenUsdPrice?: number): string {
  try {
    if (!(tokenUsdPrice && amount)) {
      return ''
    }

    return `$${(Number(formatUnits(amount?.toString(), tokenDecimals)) * tokenUsdPrice).toFixed(2)}`
  } catch (err) {
    return ''
  }
}
