import getTransferRoot from '#theGraph/getTransferRoot.js'
import { actionHandler, parseString, root } from './shared/index.js'

root
  .command('transfer-root')
  .description('Get transfer root info')
  .option('--chain <slug>', 'Chain', parseString)
  .option('--token <symbol>', 'Token', parseString)
  .option('--transfer-root-hash <hash>', 'Transfer root hash', parseString)
  .action(actionHandler(main))

async function main (source: any) {
  let { chain, token, transferRootHash, args } = source
  if (!transferRootHash) {
    transferRootHash = args[0]
  }
  if (!chain) {
    throw new Error('chain is required')
  }
  if (!token) {
    throw new Error('token is required')
  }
  if (!transferRootHash) {
    throw new Error('transfer root hash is required')
  }
  const transferRoot = await getTransferRoot(
    chain,
    token,
    transferRootHash
  )
  console.log(JSON.stringify(transferRoot, null, 2))
}
