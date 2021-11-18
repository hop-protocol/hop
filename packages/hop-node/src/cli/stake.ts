import chainSlugToId from 'src/utils/chainSlugToId'
import BondWithdrawalWatcher from 'src/watchers/BondWithdrawalWatcher'
import L1Bridge from 'src/watchers/classes/L1Bridge'
import L2Bridge from 'src/watchers/classes/L2Bridge'
import Token from 'src/watchers/classes/Token'
import { BigNumber } from 'ethers'
import { Chain } from 'src/constants'
import {
  findWatcher,
  getWatchers
} from 'src/watchers/watchers'
import {
  parseConfigFile,
  setGlobalConfigFromConfigFile
} from 'src/config'
import wait from 'src/utils/wait'
import { logger, program } from './shared'

async function sendTokensToL2 (
  bridge: L1Bridge,
  chain: string,
  parsedAmount: BigNumber
) {
  logger.debug('Sending tokens to L1')
  const tx = await bridge.convertCanonicalTokenToHopToken(
    chainSlugToId(chain)!,
    parsedAmount
  )
  await tx.wait()
}

async function stake (
  bridge: L2Bridge | L1Bridge,
  parsedAmount: BigNumber
) {
  logger.debug('Staking')
  const isBonder = await bridge.isBonder()
  if (!isBonder) {
    throw new Error('not an allowed bonder on chain')
  }

  let stakeTokenBalance: BigNumber
  const isStakeOnL2 = bridge.chainSlug !== Chain.Ethereum
  if (isStakeOnL2) {
    let token: Token = await (bridge as L2Bridge).hToken()
    stakeTokenBalance = await token.getBalance()
  } else {
    stakeTokenBalance = await bridge.getBalance(await bridge.getBonderAddress())
  }

  const formattedAmount = bridge.formatUnits(parsedAmount)
  if (stakeTokenBalance.lt(parsedAmount)) {
    throw new Error(
      `not enough hToken balance to stake. Have ${this.bridge.formatUnits(
        stakeTokenBalance
      )}, need ${formattedAmount}`
    )
  }

  logger.debug(`attempting to stake ${formattedAmount} tokens`)
  const tx = await bridge.stake(parsedAmount)
  logger.info(`stake tx: ${(tx.hash)}`)
  const receipt = await tx.wait()
  if (receipt.status) {
    logger.debug(`stake successful`)
  } else {
    logger.error('stake unsuccessful')
  }
}

async function pollConvertTxReceive (bridge: L2Bridge, convertAmount: BigNumber) {
  const l2Bridge = bridge as L2Bridge
  const bonderAddress = await bridge.getBonderAddress()
  while (true) {
    const blockNumber = await l2Bridge.getBlockNumber()
    const start = blockNumber - 100
    const end = blockNumber
    const events = await l2Bridge.getTransferFromL1CompletedEvents(
      start,
      end
    )
    for (const event of events) {
      const { amount, recipient } = event.args
      if (recipient !== bonderAddress) {
        continue
      }
      if (!amount.eq(convertAmount)) {
        continue
      }
      return true
    }
    await wait(10 * 1000)
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
  .option('-s, --skip-send-to-l2 <boolean>', 'Stake hTokens that already exist on L2')
  .action(async source => {
    try {
      const configPath = source?.config || source?.parent?.config
      if (configPath) {
        const config = await parseConfigFile(configPath)
        await setGlobalConfigFromConfigFile(config)
      }
      const chain = source.chain
      const token = source.token
      const amount = Number(source.args[0] || source.amount)
      const skipSendToL2 = source.skipSendToL2

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
        throw new Error('watcher not found')
      }
      const bridge: L2Bridge | L1Bridge = watcher.bridge
      const parsedAmount: BigNumber = bridge.parseUnits(amount)

      const isStakeOnL2 = chain !== Chain.Ethereum
      if (isStakeOnL2 && !skipSendToL2) {
        const l1Watcher = findWatcher(watchers, BondWithdrawalWatcher, Chain.Ethereum) as BondWithdrawalWatcher
        if (!l1Watcher) {
          throw new Error('watcher not found')
        }
        const l1Bridge: L1Bridge = (l1Watcher.bridge as L1Bridge)
        await sendTokensToL2(l1Bridge, chain, parsedAmount)
        logger.debug('Tokens sent to L2. Waiting for receipt on L2.')
        await pollConvertTxReceive(bridge as L2Bridge, parsedAmount)
        logger.debug('Tokens received on L2.')
      }

      await stake(bridge, parsedAmount)
      process.exit(0)
    } catch (err) {
      logger.error(err)
      process.exit(1)
    }
  })
