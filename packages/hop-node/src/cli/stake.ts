import BondWithdrawalWatcher from 'src/watchers/BondWithdrawalWatcher'
import L1Bridge from 'src/watchers/classes/L1Bridge'
import L2Bridge from 'src/watchers/classes/L2Bridge'
import Token from 'src/watchers/classes/Token'
import chainSlugToId from 'src/utils/chainSlugToId'
import wait from 'src/utils/wait'
import { BigNumber, constants } from 'ethers'
import { Chain } from 'src/constants'
import {
  findWatcher,
  getWatchers
} from 'src/watchers/watchers'
import { logger, program } from './shared'
import {
  parseConfigFile,
  setGlobalConfigFromConfigFile
} from 'src/config'

async function sendTokensToL2 (
  bridge: L1Bridge,
  parsedAmount: BigNumber,
  chain: string
) {
  const spender = bridge.getAddress()
  const token: Token | void = await getToken(bridge) // eslint-disable-line @typescript-eslint/no-invalid-void-type

  let tx
  if (token) {
    logger.debug('Approving L2 token send, if needed')
    tx = await token.approve(spender, parsedAmount)
    await tx?.wait()
  }

  logger.debug('Sending tokens to L2')
  tx = await bridge.convertCanonicalTokenToHopToken(
    chainSlugToId(chain)!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
    parsedAmount
  )
  await tx.wait()
}

async function stake (
  bridge: L2Bridge | L1Bridge,
  parsedAmount: BigNumber
) {
  logger.debug('Staking')

  const token: Token | void = await getToken(bridge) // eslint-disable-line @typescript-eslint/no-invalid-void-type
  const stakeTokenBalance: BigNumber = await getTokenBalance(bridge, token)
  const formattedAmount = bridge.formatUnits(parsedAmount)
  if (stakeTokenBalance.lt(parsedAmount)) {
    throw new Error(
      `not enough hToken balance to stake. Have ${bridge.formatUnits(
        stakeTokenBalance
      )}, need ${formattedAmount}`
    )
  }

  let tx
  if (token) {
    logger.debug('Approving token stake, if needed')
    const spender = bridge.getAddress()
    tx = await token.approve(spender, parsedAmount)
    await tx?.wait()
  }

  logger.debug(`Attempting to stake ${formattedAmount} tokens`)
  tx = await bridge.stake(parsedAmount)
  logger.info(`Stake tx: ${(tx.hash)}`)
  const receipt = await tx.wait()
  if (receipt.status) {
    logger.debug('Stake successful')
  } else {
    logger.error('Stake unsuccessful')
  }
}

async function pollConvertTxReceive (bridge: L2Bridge, convertAmount: BigNumber) {
  const l2Bridge = bridge
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

async function getToken (bridge: L2Bridge | L1Bridge): Promise<Token | void> { // eslint-disable-line @typescript-eslint/no-invalid-void-type
  const isEthSend: boolean = bridge.l1CanonicalTokenAddress === constants.AddressZero
  if (isEthSend) {
    return
  } else if (bridge.chainSlug !== Chain.Ethereum) {
    return (bridge as L2Bridge).hToken()
  }
  return (bridge as L1Bridge).l1CanonicalToken()
}

async function getTokenBalance (bridge: L2Bridge | L1Bridge, token: Token | void): Promise<BigNumber> { // eslint-disable-line @typescript-eslint/no-invalid-void-type
  if (!token) {
    return bridge.getEthBalance()
  }
  return token.getBalance()
}

async function getBridge (token: string, chain: string): Promise<L2Bridge | L1Bridge> {
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

  return watcher.bridge
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
      const bridge: L2Bridge | L1Bridge = await getBridge(token, chain)
      const parsedAmount: BigNumber = bridge.parseUnits(amount)

      const isBonder = await bridge.isBonder()
      if (!isBonder) {
        throw new Error('Not a valid bonder on the stake chain')
      }

      const isStakeOnL2 = chain !== Chain.Ethereum
      const shouldSendToL2 = isStakeOnL2 && !skipSendToL2
      if (shouldSendToL2) {
        const l1Bridge: L1Bridge = (await getBridge(token, Chain.Ethereum)) as L1Bridge
        await sendTokensToL2(l1Bridge, parsedAmount, chain)
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
