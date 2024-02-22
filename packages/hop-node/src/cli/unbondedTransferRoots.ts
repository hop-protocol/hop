import getUnbondedTransferRoots from '#src/theGraph/getUnbondedTransferRoots.js'
import { actionHandler, parseString, root } from './shared/index.js'

root
  .command('unbonded-transfer-roots')
  .description('Get unbonded transfer roots')
  .option('--source-chain <slug>', 'Source chain', parseString)
  .option('--destination-chain <slug>', 'Destination chain', parseString)
  .option('--token <symbol>', 'Token', parseString)
  .action(actionHandler(main))

async function main (source: any) {
  const { sourceChain, destinationChain, token } = source
  if (!sourceChain) {
    throw new Error('source chain is required')
  }
  if (!token) {
    throw new Error('token is required')
  }
  if (!destinationChain) {
    throw new Error('destination chain is required')
  }
  const transferRoot = await getUnbondedTransferRoots(
    sourceChain,
    token,
    destinationChain
  )
  console.log(JSON.stringify(transferRoot, null, 2))
}
