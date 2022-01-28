import BondWithdrawalWatcher from 'src/watchers/BondWithdrawalWatcher'
import L1Bridge from 'src/watchers/classes/L1Bridge'
import L2Bridge from 'src/watchers/classes/L2Bridge'
import Token from 'src/watchers/classes/Token'
import chainSlugToId from 'src/utils/chainSlugToId'
import wait from 'src/utils/wait'
import { BigNumber, constants } from 'ethers'
import { Chain } from 'src/constants'
import { actionHandler, logger, parseBool, parseNumber, parseString, root } from './shared'
import {
  findWatcher,
  getWatchers
} from 'src/watchers/watchers'

root
  .command('stake')
  .description('Stake amount')
  .option('--chain <slug>', 'Chain', parseString)
  .option('--token <symbol>', 'Token', parseString)
  .option('--amount <number>', 'Amount (in human readable format)', parseNumber)
  .option('--skip-send-to-l2 [boolean]', 'Stake hTokens that already exist on L2', parseBool)
  .action(actionHandler(main))

async function main (source: any) {
  const { chain, token, amount, skipSendToL2 } = source

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
}

async function sendTokensToL2 (
  bridge: L1Bridge,
  parsedAmount: BigNumber,
  chain: string
) {
  const recipient = await bridge.getBonderAddress()
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
    chainSlugToId(chain)!,
    parsedAmount,
    recipient
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
    const isL1Bridge = bridge.chainSlug === Chain.Ethereum
    if (isL1Bridge) {
      return
    }
  }

  if (bridge instanceof L1Bridge) {
    return (bridge as L1Bridge).l1CanonicalToken()
  } else if (bridge instanceof L2Bridge) {
    return (bridge as L2Bridge).hToken()
  } else {
    throw new Error('invalid bridge type')
  }
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
