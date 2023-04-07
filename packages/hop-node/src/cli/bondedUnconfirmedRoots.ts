import chainIdToSlug from 'src/utils/chainIdToSlug'
import getTransferRootBonded from 'src/theGraph/getTransferRootBonded'
import getTransferRootConfirmed from 'src/theGraph/getTransferRootConfirmed'
import getTransfersCommitted from 'src/theGraph/getTransfersCommitted'
import { BigNumber } from 'ethers'
import { Chain, PreRegenesisRootsCommitted } from 'src/constants'
import { actionHandler, parseString, root } from './shared'
import { DateTime } from 'luxon'

root
  .command('bonded-unconfirmed-roots')
  .description('Get all roots that have been bonded but not confirmed')
  .option('--token <symbol>', 'Token symbol', parseString)
  .option('--chain <chain>', 'Source chain', parseString)
  .action(actionHandler(main))

export async function main (source: any) {
  let { token, chain, endTimestamp } = source

  if (!endTimestamp) {
    const now = DateTime.now().toUTC()
    endTimestamp = Math.floor(now.toSeconds())
  }

  const startTimestamp = 0
  const rootsCommittedAndTotalAmounts = await getRootsCommittedAndTotalAmounts(chain, token, startTimestamp, endTimestamp)
  const rootsConfirmed = await getTransferRootConfirmed(Chain.Ethereum, token, startTimestamp, endTimestamp)
  const rootsBonded = await getTransferRootBonded(Chain.Ethereum, token, startTimestamp, endTimestamp)

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

async function getRootsCommittedAndTotalAmounts (
  chain: string,
  token: string,
  startTimestamp: number,
  endTimestamp: number
): Promise<Record<string, BigNumber>> {
  const rootsCommittedAmounts: Record<string, BigNumber> = {}
  // This represents all destination chains
  const destinationChainId = 0
  const commitsRes = await getTransfersCommitted(chain, token, destinationChainId, startTimestamp, endTimestamp)
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
