import { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { Token } from '@hop-protocol/sdk'
import { commafy } from 'src/utils'

const toPercentDisplay = (value: BigNumber | number | undefined, decimals: number | undefined = 0) => {
  if (typeof value !== 'number') {
    return '-%'
  }

  const num = Number(typeof decimals === 'number' ? formatUnits(value, decimals) : value.toString())
  const formatted = commafy(
    num * 100,
    2
  )

  return `${formatted}%`
}

export default toPercentDisplay
