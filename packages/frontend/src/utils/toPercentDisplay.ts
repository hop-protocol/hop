import { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { Token } from '@hop-protocol/sdk'
import { commafy } from 'src/utils'

const toPercentDisplay = (value: BigNumber | undefined, decimals: number | undefined) => {
  if (
    !(value &&
    decimals)
  ) {
    return '-%'
  }

  const formatted = commafy(
    formatUnits(value, decimals),
    2
  )

  return `${formatted}%`
}

export default toPercentDisplay
