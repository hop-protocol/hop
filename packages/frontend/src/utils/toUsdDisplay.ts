import { BigNumber, utils } from 'ethers'
import { commafy } from 'src/utils/commafy'

export function toUsdDisplay(amount?: BigNumber, tokenDecimals?: number, tokenUsdPrice?: number): string {
  try {
    if (!(tokenUsdPrice && tokenDecimals && amount)) {
      return ''
    }

    const value = Number(utils.formatUnits(amount?.toString(), tokenDecimals)) * tokenUsdPrice

    if (value < 0.01) {
      return `<$0.01`
    }

    return `$${commafy(value, 2)}`
  } catch (err) {
    return ''
  }
}
