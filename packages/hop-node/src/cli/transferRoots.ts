import getTransferRoots from '#theGraph/getTransferRoots.js'
import { actionHandler, parseBool, parseString, root } from './shared/index.js'

root
  .command('transfer-roots')
  .description('Get transfer roots')
  .option('--chain <slug>', 'Chain', parseString)
  .option('--token <symbol>', 'Token', parseString)
  .option('--info [boolean]', 'Show transfer root info', parseBool)
  .action(actionHandler(main))

async function main (source: any) {
  const { chain, token, info: showInfo } = source
  if (!chain) {
    throw new Error('chain is required')
  }
  if (!token) {
    throw new Error('token is required')
  }
  const transferRoots = await getTransferRoots(
    chain,
    token
  )
  console.log(JSON.stringify(transferRoots.map((x: any) => {
    if (showInfo) {
      return x
    }
    return x.rootHash
  }), null, 2))
}
