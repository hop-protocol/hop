import getTransferId from 'src/theGraph/getTransfer'
import isL1 from '@hop-protocol/hop-node-core/src/utils/isL1'
import { actionHandler, logger, parseString, root } from './shared'
import {
  getEnabledNetworks
} from 'src/config'

root
  .command('transfer-id')
  .description('Get transfer ID info')
  .option('--chain <slug>', 'Chain', parseString)
  .option('--token <symbol>', 'Token', parseString)
  .action(actionHandler(main))

async function main (source: any) {
  const { chain, token, args } = source
  const transferId = args[0]
  if (!transferId) {
    throw new Error('transfer ID is required')
  }
  if (!token) {
    throw new Error('token is required')
  }
  const chains = chain ? [chain] : getEnabledNetworks()
  for (const _chain of chains) {
    if (isL1(_chain)) {
      continue
    }
    logger.debug(`chain: ${_chain}`)
    const transfer = await getTransferId(
      _chain,
      token,
      transferId
    )
    console.log(JSON.stringify(transfer, null, 2))
  }
}
