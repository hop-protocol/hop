import { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { Token } from '@hop-protocol/sdk'
import { commafy } from 'src/utils'

const toTokenDisplay = (num: BigNumber | undefined, decimals: number | undefined, symbol?: string) => {
  if (
    !num ||
    !decimals
  ) {
    return '-'
  }

  let formatted = commafy(
    formatUnits(num, decimals),
    4
  )

  if (symbol) {
    formatted += ` ${symbol}`
  }

  return formatted
}

export default toTokenDisplay
