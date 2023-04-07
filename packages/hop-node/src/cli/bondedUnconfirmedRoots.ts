import chainIdToSlug from 'src/utils/chainIdToSlug'
import getTransferRootBonded from 'src/theGraph/getTransferRootBonded'
import getTransferRootConfirmed from 'src/theGraph/getTransferRootConfirmed'
import getTransfersCommitted from 'src/theGraph/getTransfersCommitted'
import { BigNumber } from 'ethers'
import { Chain, PreRegenesisRootsCommitted } from 'src/constants'
import { actionHandler, parseString, root } from './shared'

root
  .command('bonded-unconfirmed-roots')
  .description('Get all roots that have been bonded but not confirmed')
  .option('--token <symbol>', 'Token symbol', parseString)
  .option('--chain <chain>', 'Source chain', parseString)
  .action(actionHandler(main))

export async function main (source: any) {
  const { token, chain } = source

  const rootsCommittedAndTotalAmounts = await getRootsCommittedAndTotalAmounts(chain, token)
  const rootsConfirmed = await getTransferRootConfirmed(Chain.Ethereum, token)
  const rootsBonded = await getTransferRootBonded(Chain.Ethereum, token)

  const rootHashesConfirmed = rootsConfirmed.map((rootConfirmed: any) => rootConfirmed.rootHash)
  const rootHashesBonded = rootsBonded.map((rootBonded: any) => rootBonded.root)

  let bondedUnconfirmedRootAmount: BigNumber = BigNumber.from(0)
  for (const rootHash in rootsCommittedAndTotalAmounts) {
    if (rootHashesConfirmed.includes(rootHash)) continue
    if (!rootHashesBonded.includes(rootHash)) continue

    bondedUnconfirmedRootAmount = bondedUnconfirmedRootAmount.add(rootsCommittedAndTotalAmounts[rootHash])
  }

  return bondedUnconfirmedRootAmount
}

async function getRootsCommittedAndTotalAmounts (chain: string, token: string): Promise<Record<string, BigNumber>> {
  const rootsCommittedAmounts: Record<string, BigNumber> = {}
  const commitsRes = await getTransfersCommitted(chain, token)
  for (const res of commitsRes) {
    rootsCommittedAmounts[res.rootHash] = BigNumber.from(res.totalAmount)
  }

  for (const rootHash in PreRegenesisRootsCommitted) {
    if (rootsCommittedAmounts[rootHash]) {
      throw new Error(`Duplicate root hash: ${rootHash}`)
    }

    const nonRpcRootData = PreRegenesisRootsCommitted[rootHash]
    if (nonRpcRootData.token !== token) continue
    if (chainIdToSlug(nonRpcRootData.sourceChainId) !== chain) continue

    rootsCommittedAmounts[rootHash] = BigNumber.from(nonRpcRootData.totalAmount)
  }

  return rootsCommittedAmounts
}
