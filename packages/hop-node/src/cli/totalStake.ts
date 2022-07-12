import getStake from 'src/theGraph/getStake'
import getUnstake from 'src/theGraph/getUnstake'
import { Chain } from 'src/constants'
import { actionHandler, parseString, root } from './shared'
import { BigNumber, utils } from 'ethers'
import getTokenDecimals from 'src/utils/getTokenDecimals'

root
  .command('total-stake')
  .description('Get total stake')
  .option('--token <symbol>', 'Token symbol', parseString)
  .option('--bonder <address>', 'Bonder address', parseString)
  .action(actionHandler(main))

async function main (source: any) {
  const { token, bonder } = source
  if (!token) {
    throw new Error('token is required')
  }
  if (!bonder) {
    throw new Error('bonder is required')
  }

  const chains = [Chain.Ethereum, Chain.Polygon, Chain.Gnosis, Chain.Optimism, Chain.Arbitrum]
  for (const chain of chains) {
    let totalStake = BigNumber.from('0')

    const stakeRes = await getStake(chain, token, bonder)
    for (const stake of stakeRes) {
      const amount = stake.amount
      totalStake = totalStake.add(amount)
    }

    const unstakeRes = await getUnstake(chain, token, bonder)
    for (const unstake of unstakeRes) {
      const amount = unstake.amount
      totalStake = totalStake.sub(amount)
    }

    totalStake = getAdditionalAmounts(chain, token, bonder, totalStake)
    const decimals = getTokenDecimals(token)
    console.log(chain, utils.formatUnits(totalStake, decimals))
  }
}

function getAdditionalAmounts(
  chain: string,
  token: string,
  bonder: string,
  totalAmount: BigNumber
): BigNumber {
  // USDC bonder staked in OVM1
  if (
    chain === Chain.Optimism &&
    token === 'USDC' &&
    bonder.toLowerCase() === '0xa6a688f107851131f0e1dce493ebbebfaf99203e'
  ) {
    const decimals = getTokenDecimals(token)
    const amount = utils.parseUnits('250000', decimals)
    totalAmount = totalAmount.add(amount)
  }

  return totalAmount
}
