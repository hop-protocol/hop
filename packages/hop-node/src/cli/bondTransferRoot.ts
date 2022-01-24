import BondTransferRootWatcher from 'src/watchers/BondTransferRootWatcher'
import { BigNumber } from 'ethers'
import {
  findWatcher,
  getWatchers
} from 'src/watchers/watchers'

import chainSlugToId from 'src/utils/chainSlugToId'
import { actionHandler, parseBool, parseString, root } from './shared'

root
  .command('bond-transfer-root')
  .description('Bond transfer root')
  .option('--source-chain <slug>', 'Source chain', parseString)
  .option('--destination-chain <slug>', 'Destination chain', parseString)
  .option('--token <symbol>', 'Token', parseString)
  .option('--root-hash <hash>', 'Transfer root hash', parseString)
  .option('--total-amount <amount>', 'Total amount of the root', parseString)
  .option(
    '--dry [boolean]',
    'Start in dry mode. If enabled, no transactions will be sent.',
    parseBool
  )
  .action(actionHandler(main))

async function main (source: any) {
  const {
    sourceChain: chain,
    destinationChain,
    token,
    rootHash,
    totalAmount,
    dry: dryMode
  } = source
  if (!chain) {
    throw new Error('chain is required')
  }
  if (!destinationChain) {
    throw new Error('destination chain is required')
  }
  if (!token) {
    throw new Error('token is required')
  }
  if (!rootHash) {
    throw new Error('transfer root hash is required')
  }
  if (!totalAmount) {
    throw new Error('total amount is required')
  }

  const watchers = await getWatchers({
    enabledWatchers: ['bondTransferRoot'],
    tokens: [token],
    dryMode
  })

  const watcher = findWatcher(watchers, BondTransferRootWatcher, chain) as BondTransferRootWatcher 
  if (!watcher) {
    throw new Error('watcher not found')
  }


  const destinationChainId = chainSlugToId(destinationChain)
  if (!destinationChainId) {
    throw new Error('destination chain id is required')
  }
  const totalAmountBn = BigNumber.from(totalAmount)
  await watcher.sendBondTransferRoot(rootHash, destinationChainId, totalAmountBn)
}
