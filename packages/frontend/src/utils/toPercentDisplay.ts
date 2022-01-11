import { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
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
      typeof decimals === 'number' && decimals > 0 ? formatUnits(value, decimals) : value.toString()
    )
    const formatted = commafy(num * 100, 2)

    return `${formatted}%`
  } catch (err) {
    console.error(err)
    return '-%'
  }
}
