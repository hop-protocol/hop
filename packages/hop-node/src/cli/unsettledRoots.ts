import chainSlugToId from 'src/utils/chainSlugToId'
import getBondedWithdrawal from 'src/theGraph/getBondedWithdrawal'
import getMultipleWithdrawalsSettled from 'src/theGraph/getMultipleWithdrawalsSettled'
import getTokenDecimals from 'src/utils/getTokenDecimals'
import getTransferIdsForTransferRoot from 'src/theGraph/getTransferIdsForTransferRoot'
import getTransfersCommitted from 'src/theGraph/getTransfersCommitted'
import { BigNumber, utils } from 'ethers'
import { actionHandler, parseString, root } from './shared'
import { getSourceChains } from 'src/config'

type SettledRootsPerBonder = Record<string, Record<string, BigNumber>>

root
  .command('unsettled-roots')
  .description('Get all unsettled roots, their unsettled amounts, and the unsettled bonder')
  .option('--token <symbol>', 'Token symbol', parseString)
  .option('--chain <slug>', 'Chain', parseString)
  .action(actionHandler(main))

async function main (source: any) {
  const { chain: settlementChain, token } = source
  if (!settlementChain) {
    throw new Error('chain is required')
  }
  if (!token) {
    throw new Error('token is required')
  }

  console.log('\n*** This will only look back until 01/01/2022. Prior data may be invalid due to the OVM regenesis. ***\n')
  const startTimestamp = 1640995200
  const decimals = getTokenDecimals(token)

  // Get all settlements
  const settledRootsPerBonder: SettledRootsPerBonder = await getSettledRoots(settlementChain, token)

  // Get all roots from source chains
  const sourceChains = getSourceChains(token, settlementChain)

  for (const chain of sourceChains) {
    console.log(`Searching ${chain}`)

    // Get all roots that were committed at the source
    const settlementChainId = chainSlugToId(settlementChain)
    const commitsRes = await getTransfersCommitted(chain, token, settlementChainId, startTimestamp)
    const rootsCommitted: any = {}
    for (const res of commitsRes) {
      rootsCommitted[res.rootHash] = BigNumber.from(res.totalAmount)
    }

    // Get all roots that are not fully settled
    const unsettledRoots: string[] = []
    for (const root in rootsCommitted) {
      let diff: BigNumber = rootsCommitted[root]

      for (const bonder in settledRootsPerBonder) {
        if (!settledRootsPerBonder[bonder][root]) continue
        diff = rootsCommitted[root].sub(settledRootsPerBonder[bonder][root])
      }

      const isFullySettled = diff.eq('0')
      if (isFullySettled) continue
      unsettledRoots.push(root)
    }

    // Get transferIds for the unsettled roots
    const transfersPerRoot: any = {}
    for (const root of unsettledRoots) {
      const transfers: any = await getTransferIdsForTransferRoot(chain, token, root)
      for (const transfer of transfers) {
        if (!transfersPerRoot[root]) {
          transfersPerRoot[root] = []
        }
        transfersPerRoot[root].push(transfer.transferId)
      }
    }

    // Log which roots have unsettled transfers
    let tempAmt = BigNumber.from('0')
    for (const root of unsettledRoots) {
      const bondedAmountPerBonder: any = {}

      const transferIds = transfersPerRoot[root]
      for (const transferId of transferIds) {
        const bondData = await getBondedWithdrawal(settlementChain, token, transferId)
        if (!bondData) continue

        tempAmt = tempAmt.add(bondData.amount)
        const bonder = bondData.from

        if (!bondedAmountPerBonder[bonder]) {
          bondedAmountPerBonder[bonder] = BigNumber.from('0')
        }
        bondedAmountPerBonder[bonder] = bondedAmountPerBonder[bonder].add(bondData.amount)
      }

      for (const bonder in bondedAmountPerBonder) {
        const amount = bondedAmountPerBonder[bonder]
        let diff: BigNumber
        if (settledRootsPerBonder?.[bonder]?.[root]) {
          diff = amount.sub(settledRootsPerBonder[bonder][root])
        } else {
          diff = amount
        }

        const isFullySettled = diff.eq('0')
        if (isFullySettled) continue
        console.log(`${root} ${bonder} ${utils.formatUnits(diff, decimals)} (${diff})`)
      }
    }
    console.log('\n')
  }
}

async function getSettledRoots (chain: string, token: string): Promise<SettledRootsPerBonder> {
  const multipleWithdrawalsSettledRes = await getMultipleWithdrawalsSettled(chain, token)
  const settledPerBonder: any = {}
  for (const res of multipleWithdrawalsSettledRes) {
    const bonder = res.bonder
    const rootHash = res.rootHash

    if (!settledPerBonder[bonder]) {
      settledPerBonder[bonder] = {}
    }
    if (!settledPerBonder[bonder][rootHash]) {
      settledPerBonder[bonder][rootHash] = BigNumber.from('0')
    }

    settledPerBonder[bonder][rootHash] = settledPerBonder[bonder][rootHash].add(res.totalBondsSettled)
  }

  return settledPerBonder
}
