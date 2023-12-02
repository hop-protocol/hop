import L1Bridge from 'src/watchers/classes/L1Bridge'
import L2Bridge from 'src/watchers/classes/L2Bridge'
import { BigNumber } from 'ethers'
import { ShouldIgnoreProxy, getProxyAddressForChain, isProxyAddressForChain } from 'src/config'
import { WatcherNotFoundError } from './shared/utils'
import { actionHandler, logger, parseBool, parseNumber, parseString, root } from './shared'
import {
  getBondWithdrawalWatcher
} from 'src/watchers/watchers'

root
  .command('unstake')
  .description('Unstake amount')
  .option('--chain <slug>', 'Chain', parseString)
  .option('--token <symbol>', 'Token', parseString)
  .option('--amount <number>', 'Amount (in human readable format)', parseNumber)
  .option('--ignore-proxy [boolean]', 'Ignore the proxy address', parseBool)
  .action(actionHandler(main))

async function main (source: any) {
  const { chain, token, amount, ignoreProxy } = source

  if (!amount) {
    throw new Error('amount is required. E.g. 100')
  }
  if (!chain) {
    throw new Error('chain is required')
  }

  if (ignoreProxy && !ShouldIgnoreProxy) {
    logger.warn('In order to ignore the proxy address, please add the environment variable SHOULD_IGNORE_PROXY=true and run this again')
    return
  }

  // Arbitrary watcher since only the bridge is needed
  const watcher = await getBondWithdrawalWatcher({ chain, token, dryMode: false })
  if (!watcher) {
    throw new Error(WatcherNotFoundError)
  }
  const bridge: L2Bridge | L1Bridge = watcher.bridge
  const parsedAmount: BigNumber = bridge.parseUnits(amount)
  const isBonder = await bridge.isBonder()
  if (!isBonder) {
    throw new Error('Not a valid bonder on the stake chain')
  }

  await unstake(bridge, parsedAmount)
}

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
    logger.debug(`successfully unstaked ${bridge.formatUnits(parsedAmount)} tokens`)
  } else {
    logger.error('unstake was unsuccessful. tx status=0')
  }

  if (isProxyAddressForChain(bridge.tokenSymbol, bridge.chainSlug)) {
    const proxyAddress = getProxyAddressForChain(bridge.tokenSymbol, bridge.chainSlug)
    if (receipt.to === proxyAddress) {
      logger.debug('Please use the claim-from-proxy command to send tokens from the proxy contract')
    }
  }
}
