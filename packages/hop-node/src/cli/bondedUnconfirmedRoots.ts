import chainIdToSlug from 'src/utils/chainIdToSlug'
import getTransferRootBonded from 'src/theGraph/getTransferRootBonded'
import getTransferRootConfirmed from 'src/theGraph/getTransferRootConfirmed'
import getTransfersCommitted from 'src/theGraph/getTransfersCommitted'
import { BigNumber } from 'ethers'
import { Chain, PreRegenesisRootsCommitted } from 'src/constants'
import { DateTime } from 'luxon'
import { actionHandler, parseString, root } from './shared'

type RootCommitted = {
  rootHash: string
  totalAmount: BigNumber
  destinationChainId: string
  rootCommittedAt: string
}

root
  .command('bonded-unconfirmed-roots')
  .description('Get all roots that have been bonded but not confirmed')
  .option('--token <symbol>', 'Token symbol', parseString)
  .option('--chain <chain>', 'Source chain', parseString)
  .action(actionHandler(main))

export async function main (source: any) {
  let { token, chain, endTimestamp } = source

  const shouldLogData = isCliCall()

  if (!endTimestamp) {
    const now = DateTime.now().toUTC()
    endTimestamp = Math.floor(now.toSeconds())
  }

  const startTimestamp = 0
  const rootsCommitted = await getRootsCommitted(chain, token, startTimestamp, endTimestamp)
  const rootsConfirmed = await getTransferRootConfirmed(Chain.Ethereum, token, startTimestamp, endTimestamp)
  const rootsBonded = await getTransferRootBonded(Chain.Ethereum, token, startTimestamp, endTimestamp)

  const rootHashesConfirmed = rootsConfirmed.map((rootConfirmed: any) => rootConfirmed.rootHash)
  const rootHashesBonded = rootsBonded.map((rootBonded: any) => rootBonded.root)

  const rootsToLog: RootCommitted[] = []
  let bondedUnconfirmedRootAmount: BigNumber = BigNumber.from(0)
  for (const rootCommitted of rootsCommitted) {
    const rootHash = rootCommitted.rootHash
    if (rootHashesConfirmed.includes(rootHash)) continue
    if (!rootHashesBonded.includes(rootHash)) continue

    bondedUnconfirmedRootAmount = bondedUnconfirmedRootAmount.add(rootCommitted.totalAmount)
    rootsToLog.push(rootCommitted)
  }

  if (shouldLogData) {
    console.log('rootHash, totalAmount, destinationChainId, rootCommittedAt')
    const sortedRootsToLog = rootsToLog.sort((a, b) => Number(b.rootCommittedAt) - Number(a.rootCommittedAt))
    for (const rootToLog of sortedRootsToLog) {
      const date = DateTime.fromSeconds(Number(rootToLog.rootCommittedAt)).toUTC()
      console.log(`${rootToLog.rootHash}, ${rootToLog.totalAmount.toString()}, ${rootToLog.destinationChainId || 'pre-regenesis'}, ${date}`)
    }
  }
  return bondedUnconfirmedRootAmount
}

function isCliCall (): boolean {
  return process.argv[2] === 'bonded-unconfirmed-roots'
}

async function getRootsCommitted (
  chain: string,
  token: string,
  startTimestamp: number,
  endTimestamp: number
): Promise<RootCommitted[]> {
  const rootsCommitted: RootCommitted[] = []
  // This represents all destination chains
  const destinationChainId = 0
  const commitsRes = await getTransfersCommitted(chain, token, destinationChainId, startTimestamp, endTimestamp)
  for (const res of commitsRes) {
    rootsCommitted.push({
      rootHash: res.rootHash,
      totalAmount: BigNumber.from(res.totalAmount),
      destinationChainId: res.destinationChainId,
      rootCommittedAt: res.rootCommittedAt
    })
  }

  for (const preRegenesisRootCommitted of PreRegenesisRootsCommitted) {
    if (preRegenesisRootCommitted.token !== token) continue
    if (chainIdToSlug(preRegenesisRootCommitted.sourceChainId) !== chain) continue

    rootsCommitted.push({
      rootHash: preRegenesisRootCommitted.rootHash,
      totalAmount: BigNumber.from(preRegenesisRootCommitted.totalAmount),
      destinationChainId: preRegenesisRootCommitted.destinationChainId,
      rootCommittedAt: preRegenesisRootCommitted.rootCommittedAt
    })
  }

  // Sanity check
  const rootHashesSeen: string[] = []
  for (const rootCommitted of rootsCommitted) {
    if (rootHashesSeen.includes(rootCommitted.rootHash)) {
      throw new Error(`Duplicate root hash: ${rootCommitted.rootHash}`)
    }
    rootHashesSeen.push(rootCommitted.rootHash)
  }

  return rootsCommitted
}
