import { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { Token } from '@hop-protocol/sdk'
import { commafy } from 'src/utils'

const toTokenDisplay = (num: BigNumber | undefined, token: Token | undefined) => {
  if (
    !num ||
    !token
  ) {
    return '-'
  }

  const formatted = commafy(
    formatUnits(num, token.decimals),
    4
  )

  return `${formatted} ${token.symbol}`
}

export default toTokenDisplay
