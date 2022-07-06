import getTransferRootBonded from 'src/theGraph/getTransferRootBonded'
import getTransferRootConfirmed from 'src/theGraph/getTransferRootConfirmed'
import getTransfersCommitted from 'src/theGraph/getTransfersCommitted'
import { Chain } from 'src/constants'
import { actionHandler, parseString, root } from './shared'

root
  .command('verify-commits')
  .description('Verify that a commit has made it to L1')
  .option('--token <symbol>', 'Token symbol', parseString)
  .option('--chain <slug>', 'Chain', parseString)
  .action(actionHandler(main))

async function main (source: any) {
  const { chain, token } = source
  if (!chain) {
    throw new Error('chain is required')
  }
  if (!token) {
    throw new Error('token is required')
  }

  const commitsRes = await getTransfersCommitted(chain, token)
  const rootsCommitted: string[] = []
  for (const res of commitsRes) {
    rootsCommitted.push(res.rootHash)
  }
  console.log(`Commits retrieved: ${rootsCommitted.length}`)

  const confirmedRes = await getTransferRootConfirmed(Chain.Ethereum, token)
  const rootsConfirmed: string[] = []
  for (const res of confirmedRes) {
    rootsConfirmed.push(res.rootHash)
  }
  console.log(`Confirms retrieved: ${rootsConfirmed.length}`)

  const bondedRes = await getTransferRootBonded(Chain.Ethereum, token)
  const rootsBonded: string[] = []
  for (const res of bondedRes) {
    rootsBonded.push(res.root)
  }
  console.log(`Bonds retrieved: ${rootsBonded.length}`)

  const unverifiedRoots: string[] = []
  for (const rootCommitted of rootsCommitted) {
    if (rootsConfirmed.includes(rootCommitted)) continue
    if (rootsBonded.includes(rootCommitted)) continue

    unverifiedRoots.push(rootCommitted)
  }

  console.log(`\nThere are ${unverifiedRoots.length} unverified roots.`)
  if (unverifiedRoots.length !== 0) {
    console.log(unverifiedRoots)
  }
}
