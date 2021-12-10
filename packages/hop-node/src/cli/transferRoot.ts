import getTransferRoot from 'src/theGraph/getTransferRoot'
import { actionHandler, parseString, root } from './shared'

root
  .command('transfer-root')
  .description('Get transfer root info')
  .option('--chain <slug>', 'Chain', parseString)
  .option('--token <symbol>', 'Token', parseString)
  .action(actionHandler(main))

async function main (source: any) {
  const { chain, token, args } = source
  const transferRootHash = args[0]
  if (!chain) {
    throw new Error('chain is required')
  }
  if (!token) {
    throw new Error('token is required')
  }
  const transferRoot = await getTransferRoot(
    chain,
    token,
    transferRootHash
  )
  console.log(JSON.stringify(transferRoot, null, 2))
}
