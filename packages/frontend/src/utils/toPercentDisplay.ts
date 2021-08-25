import { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { Token } from '@hop-protocol/sdk'
import { commafy } from 'src/utils'

const toPercentDisplay = (value: BigNumber | number | undefined, decimals: number | undefined = 0) => {
  if (value === undefined) {
    return '-%'
  }

  try {
    const num = Number(typeof decimals === 'number' && decimals > 0 ? formatUnits(value, decimals) : value.toString())
    const formatted = commafy(
      num * 100,
      2
    )

    return `${formatted}%`
  } catch (err) {
    console.error(err)
    return '-%'
  }
}

export default toPercentDisplay
