import getStake from 'src/theGraph/getStake'
import getTokenDecimals from 'src/utils/getTokenDecimals'
import getUnstake from 'src/theGraph/getUnstake'
import { BigNumber, utils } from 'ethers'
import { Chain } from 'src/constants'
import { actionHandler, parseString, root } from './shared'

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

  const chains = [Chain.Ethereum, Chain.Polygon, Chain.Gnosis, Chain.Optimism, Chain.Arbitrum, Chain.Nova, Chain.Base, Chain.Linea]
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

function getAdditionalAmounts (
  chain: string,
  token: string,
  bonder: string,
  totalAmount: BigNumber
): BigNumber {
  // Stakes/Unstakes on OVM1
  if (
    chain === Chain.Optimism &&
    token === 'USDC' &&
    bonder.toLowerCase() === '0xa6a688f107851131f0e1dce493ebbebfaf99203e'
  ) {
    const decimals = getTokenDecimals(token)
    const amount = utils.parseUnits('250000', decimals)
    totalAmount = totalAmount.add(amount)
  }

  // 0xd6b7c02c8fd7fbd2b2b7f013dc292c92d98d95f82f1cf836f4e2ac342dbfa108
  if (
    chain === Chain.Optimism &&
    token === 'USDC' &&
    bonder.toLowerCase() === '0x2a6303e6b99d451df3566068ebb110708335658f'
  ) {
    const decimals = getTokenDecimals(token)
    const amount = utils.parseUnits('49', decimals)
    totalAmount = totalAmount.add(amount)
  }

  // 0x80bd71cc257e2c489253cbbf774278f8c3e244b2158dfdc16a6a64e314c2702b
  if (
    chain === Chain.Optimism &&
    token === 'USDC' &&
    bonder.toLowerCase() === '0x2a6303e6b99d451df3566068ebb110708335658f'
  ) {
    const decimals = getTokenDecimals(token)
    const amount = utils.parseUnits('740', decimals)
    totalAmount = totalAmount.add(amount)
  }

  // 0xf587c7942fb63b324bd15e502bed151eebde7175c652e6c7f9e5817d31a14b13
  if (
    chain === Chain.Optimism &&
    token === 'USDC' &&
    bonder.toLowerCase() === '0x2a6303e6b99d451df3566068ebb110708335658f'
  ) {
    const decimals = getTokenDecimals(token)
    const amount = utils.parseUnits('5020', decimals)
    totalAmount = totalAmount.add(amount)
  }

  // 0xd93d0740f2c065b245c2649476cc39360184b23abc7a4fc4ad91c1ed89e62b91
  if (
    chain === Chain.Optimism &&
    token === 'USDT' &&
    bonder.toLowerCase() === '0x2a6303e6b99d451df3566068ebb110708335658f'
  ) {
    const decimals = getTokenDecimals(token)
    const amount = utils.parseUnits('8492', decimals)
    totalAmount = totalAmount.add(amount)
  }

  // 0xeae824b3c54add6558701c26c1fc7ecb9f204782e68208bc8b83aef4870fd5b4
  if (
    chain === Chain.Optimism &&
    token === 'USDT' &&
    bonder.toLowerCase() === '0x2a6303e6b99d451df3566068ebb110708335658f'
  ) {
    const decimals = getTokenDecimals(token)
    const amount = utils.parseUnits('300', decimals)
    totalAmount = totalAmount.sub(amount)
  }

  // 0x1857f8bd17faefc36d3b211e7a1be32d3d9eca44b311ff11400ab32111925b3a
  if (
    chain === Chain.Optimism &&
    token === 'ETH' &&
    bonder.toLowerCase() === '0x2a6303e6b99d451df3566068ebb110708335658f'
  ) {
    const decimals = getTokenDecimals(token)
    const amount = utils.parseUnits('0.000001', decimals)
    totalAmount = totalAmount.add(amount)
  }

  // 0xaa90c61e8bf78237e4c58531fb2d4d5a70632e8922ce0583be10433773ad543e
  if (
    chain === Chain.Optimism &&
    token === 'ETH' &&
    bonder.toLowerCase() === '0x2a6303e6b99d451df3566068ebb110708335658f'
  ) {
    const decimals = getTokenDecimals(token)
    const amount = utils.parseUnits('0.000001', decimals)
    totalAmount = totalAmount.add(amount)
  }

  // 0xa12289b29351902458d8565386694ea645ba093dbde45ded9c3f3456b3c709e7
  if (
    chain === Chain.Optimism &&
    token === 'ETH' &&
    bonder.toLowerCase() === '0x2a6303e6b99d451df3566068ebb110708335658f'
  ) {
    const decimals = getTokenDecimals(token)
    const amount = utils.parseUnits('1', decimals)
    totalAmount = totalAmount.add(amount)
  }

  // 0xac40d22c4f2e89fd7aca0bdae883f06bd28d618c6dfcfa6286243a37d2652a7d
  if (
    chain === Chain.Optimism &&
    token === 'ETH' &&
    bonder.toLowerCase() === '0x2a6303e6b99d451df3566068ebb110708335658f'
  ) {
    const decimals = getTokenDecimals(token)
    const amount = utils.parseUnits('1.5', decimals)
    totalAmount = totalAmount.add(amount)
  }

  // 0xe324e70b078429f49a2ff2a7e9f9a5373e97ad8c41819c9eeac5c04f39d97b95
  if (
    chain === Chain.Optimism &&
    token === 'ETH' &&
    bonder.toLowerCase() === '0x2a6303e6b99d451df3566068ebb110708335658f'
  ) {
    const decimals = getTokenDecimals(token)
    const amount = utils.parseUnits('1', decimals)
    totalAmount = totalAmount.add(amount)
  }

  // 0xb706d977d0aaacf0f6c9346816f757d56b43d8a2a3dce5058ba7c6746a7951e8
  if (
    chain === Chain.Optimism &&
    token === 'DAI' &&
    bonder.toLowerCase() === '0x2a6303e6b99d451df3566068ebb110708335658f'
  ) {
    const decimals = getTokenDecimals(token)
    const amount = utils.parseUnits('45', decimals)
    totalAmount = totalAmount.add(amount)
  }

  return totalAmount
}
