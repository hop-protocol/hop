import { BigNumber } from 'ethers'
import { commafy } from 'src/utils/commafy'
import { formatUnits } from 'ethers/lib/utils'

export function toUsdDisplay(amount?: BigNumber, tokenDecimals?: number, tokenUsdPrice?: number): string {
  try {
    if (!(tokenUsdPrice && tokenDecimals && amount)) {
      return ''
    }

    const value = Number(formatUnits(amount?.toString(), tokenDecimals)) * tokenUsdPrice

    if (value < 0.01) {
      return `<$0.01`
    }

    return `$${commafy(value, 2)}`
  } catch (err) {
    return ''
  }
}
