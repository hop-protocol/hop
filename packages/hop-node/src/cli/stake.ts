import { Chain } from 'src/constants'
import {
  FileConfig,
  parseConfigFile,
  setGlobalConfigFromConfigFile
} from 'src/config'
import {
  getStakeWatchers
} from 'src/watchers/watchers'

import { logger, program } from './shared'

export enum StakerAction {
  Stake,
  Unstake,
  Status
}

export async function staker (
  chain: string,
  token: string,
  amount: number,
  action: StakerAction
) {
  if (!chain) {
    throw new Error(
      'chain is required. Options are: ethereum, xdai, polygon, optimism, arbitrum'
    )
  }
  if (!token) {
    throw new Error(
      'token is required: Options are: USDC, DAI, etc... Use correct capitalization.'
    )
  }

  const watchers = getStakeWatchers(
    [token],
    [Chain.Optimism, Chain.Arbitrum, Chain.xDai, Chain.Polygon, Chain.Ethereum]
  )
  const stakeWatcher = watchers[0].getSiblingWatcherByChainSlug(chain)
  if (action === StakerAction.Stake) {
    logger.debug('action: stake')
    if (!amount) {
      throw new Error('amount is required. E.g. 100')
    }
    const parsedAmount = stakeWatcher.bridge.parseUnits(amount)
    await stakeWatcher.approveTokens()
    await stakeWatcher.convertAndStake(parsedAmount)
  } else if (action === StakerAction.Unstake) {
    logger.debug('action: unstake')
    if (!amount) {
      throw new Error('amount is required. E.g. 100')
    }
    const parsedAmount = stakeWatcher.bridge.parseUnits(amount)
    await stakeWatcher.unstake(parsedAmount)
  } else {
    await stakeWatcher.printAmounts()
  }
}

program
  .command('stake')
  .description('Stake amount')
  .option('--config <string>', 'Config file to use.')
  .option('--env <string>', 'Environment variables file')
  .option('-c, --chain <string>', 'Chain')
  .option('-t, --token <string>', 'Token')
  .option('-a, --amount <number>', 'Amount (in human readable format)')
  .action(async source => {
    try {
      const configPath = source?.config || source?.parent?.config
      if (configPath) {
        const config: FileConfig = await parseConfigFile(configPath)
        await setGlobalConfigFromConfigFile(config)
      }
      const chain = source.chain
      const token = source.token
      const amount = Number(source.args[0] || source.amount)
      await staker(chain, token, amount, StakerAction.Stake)
      process.exit(0)
    } catch (err) {
      logger.error(err)
      process.exit(1)
    }
  })
