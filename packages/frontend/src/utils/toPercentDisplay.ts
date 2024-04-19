import { BigNumber, utils } from 'ethers'
import { commafy } from 'src/utils'

export const toPercentDisplay = (
  value: BigNumber | number | undefined,
  decimals: number | undefined = 0
) => {
  if (value === undefined || value === null) {
    return '-%'
  }

  try {
    const num = Number(
      typeof decimals === 'number' && decimals > 0 ? utils.formatUnits(value, decimals) : value.toString()
    )
    const formatted = commafy(num * 100, 2)

    return `${formatted}%`
  } catch (err) {
    console.error(err)
    return '-%'
  }
}
