import BondWithdrawalWatcher from 'src/watchers/BondWithdrawalWatcher'
import L1Bridge from 'src/watchers/classes/L1Bridge'
import L2Bridge from 'src/watchers/classes/L2Bridge'
import { BigNumber } from 'ethers'
import {
  findWatcher,
  getWatchers
} from 'src/watchers/watchers'
import { logger, program } from './shared'
import {
  parseConfigFile,
  setGlobalConfigFromConfigFile
} from 'src/config'

export async function unstake (
  bridge: L2Bridge | L1Bridge,
  parsedAmount: BigNumber
) {
  logger.debug('Unstaking')
  const [credit, debit] = await Promise.all([
    bridge.getCredit(),
    bridge.getDebit()
  ])

  const availableCredit = credit.sub(debit)
  if (parsedAmount.gt(availableCredit)) {
    throw new Error(
      `Cannot unstake more than the available credit ${bridge.formatUnits(
       availableCredit
      )}`
    )
  }

  logger.debug(`attempting to unstake ${bridge.formatUnits(parsedAmount)} tokens`)
  const tx = await bridge.unstake(parsedAmount)
  logger.info(`unstake tx: ${(tx.hash)}`)
  const receipt = await tx.wait()
  if (receipt.status) {
    logger.debug(`successfully unstaked ${parsedAmount} tokens`)
  } else {
    logger.error('unstake was unsuccessful. tx status=0')
  }
}

program
  .command('unstake')
  .description('Unstake amount')
  .option('--config <string>', 'Config file to use.')
  .option('--env <string>', 'Environment variables file')
  .option('-c, --chain <string>', 'Chain')
  .option('-t, --token <string>', 'Token')
  .option('-a, --amount <number>', 'Amount (in human readable format)')
  .action(async (source: any) => {
    try {
      const configPath = source?.config || source?.parent?.config
      if (configPath) {
        const config = await parseConfigFile(configPath)
        await setGlobalConfigFromConfigFile(config)
      }
      const chain = source.chain
      const token = source.token
      const amount = Number(source.args[0] || source.amount)

      if (!amount) {
        throw new Error('amount is required. E.g. 100')
      }
      if (!chain) {
        throw new Error('chain is required')
      }

      // Arbitrary watcher since only the bridge is needed
      const watchers = await getWatchers({
        enabledWatchers: ['bondWithdrawal'],
        tokens: [token],
        dryMode: false
      })

      const watcher = findWatcher(watchers, BondWithdrawalWatcher, chain) as BondWithdrawalWatcher
      if (!watcher) {
        throw new Error('Watcher not found')
      }
      const bridge: L2Bridge | L1Bridge = watcher.bridge
      const parsedAmount: BigNumber = bridge.parseUnits(amount)
      const isBonder = await bridge.isBonder()
      if (!isBonder) {
        throw new Error('Not a valid bonder on the stake chain')
      }

      await unstake(bridge, parsedAmount)
      process.exit(0)
    } catch (err) {
      logger.error(err)
      process.exit(1)
    }
  })
