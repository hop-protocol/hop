import { BigNumber, utils } from 'ethers'
import { commafy } from '#utils/commafy.js'

export function toUsd(amount?: BigNumber, tokenDecimals?: number, tokenUsdPrice?: number): number {
  try {
    if (!(tokenUsdPrice && tokenDecimals && amount)) {
      return 0
    }

    return Number(utils.formatUnits(amount?.toString(), tokenDecimals)) * tokenUsdPrice
  } catch (err) {
    return 0
  }
}

export function formatUsdDisplay(value: number): string {
  try {
    if (value < 0.01) {
      return `<$0.01`
    }

    if (value <= 0) {
      return '0'
    }

    return `$${commafy(value, 2)}`
  } catch (err) {
    return ''
  }
}

export function toUsdDisplay(amount?: BigNumber, tokenDecimals?: number, tokenUsdPrice?: number): string {
  try {
    if (!(tokenUsdPrice && tokenDecimals && amount)) {
      return ''
    }

    const value = toUsd(amount, tokenDecimals, tokenUsdPrice)

    return formatUsdDisplay(value)
  } catch (err) {
    return ''
  }
}
