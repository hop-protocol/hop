import chainSlugToId from 'src/utils/chainSlugToId'
import makeRequest from './makeRequest'
import { BigNumber } from 'ethers'

type TransferCommitted = {
  blockNumber: string
  rootHash: string
  totalAmount: string
  transactionIndex: string
}

type MultipleWithdrawalsSettled = {
  totalBondsSettled: string
}

type TransferSent = {
  transferId: string
  amount: string
  transactionIndex: string
  blockNumber: string
}

type WithdrawnTransfer = {
  amount: string
}

type BondedTransfer = {
  amount: string
}

export default async function getIncompleteSettlements (token: string, chain: string, destinationChain: string): Promise<any> {
  const destinationChainId: number = chainSlugToId(destinationChain)! // eslint-disable-line

  const transfersCommitted: TransferCommitted[] = await getTransfersCommitted(
    token,
    chain,
    destinationChainId
  )
  if (!transfersCommitted) {
    throw new Error('there are no committed transfers')
  }

  const numTransfersCommitted = transfersCommitted.length
  console.log(`Number of transfersCommitted: ${numTransfersCommitted}`)
  for (let i = 0; i < transfersCommitted.length; i++) {
    console.log(`checking ${i + 1}/${numTransfersCommitted}`)
    const { rootHash, totalAmount, blockNumber, transactionIndex } = transfersCommitted[i]
    const totalAmountBn: BigNumber = BigNumber.from(totalAmount)

    const multipleWithdrawalsSettled: MultipleWithdrawalsSettled[] = await getMultipleWithdrawalsSettled(
      destinationChain,
      rootHash
    )
    let calcAmountBn: BigNumber = BigNumber.from(0)
    for (let j = 0; j < multipleWithdrawalsSettled.length; j++) {
      const amountSettled: string = multipleWithdrawalsSettled[j].totalBondsSettled
      calcAmountBn = calcAmountBn.add(amountSettled)
    }

    // There is an edge case where, if the earliest committed root contains an unbonded
    // or unwithdrawn transfer, this script will not be aware of it. The result is
    // that the earliest committed root may be shown as incomplete even if it is
    // actually complete
    const nextTransferCommitted = transfersCommitted[i + 1]
    const isEarliestCommit = !nextTransferCommitted
    if (!isEarliestCommit) {
      const startBlockNumber = nextTransferCommitted.blockNumber
      const startTransactionIndex = nextTransferCommitted.transactionIndex
      const endBlockNumber = blockNumber
      const endTransactionIndex = transactionIndex
      let transferSent: TransferSent[] = await getTransferSent(
        token,
        chain,
        destinationChainId,
        startBlockNumber,
        endBlockNumber
      )

      // Put transfers in chronological order
      transferSent = transferSent.reverse()
      for (let k = 0; k < transferSent.length; k++) {
        const { transferId, amount: transferAmount, transactionIndex, blockNumber } = transferSent[k]

        if (k === 0) {
          if (transactionIndex < startTransactionIndex && blockNumber === startBlockNumber) {
            continue
          }
        } else if (k === transferSent.length - 1) {
          if (transactionIndex > endTransactionIndex && blockNumber === endBlockNumber) {
            continue
          }
        }

        // Add any transfers that were completed using `withdraw()`
        const withdrawnTransfer: WithdrawnTransfer[] = await getWithdrew(
          destinationChain,
          transferId
        )
        if (withdrawnTransfer.length !== 0) {
          const amount = withdrawnTransfer[0].amount
          calcAmountBn = calcAmountBn.add(amount)
          continue
        }

        // Add any transfers that were not bonded
        const bondedTransfer: BondedTransfer[] = await getBondedTransfer(
          destinationChain,
          transferId
        )
        if (bondedTransfer.length !== 0) {
          continue
        }
        calcAmountBn = calcAmountBn.add(transferAmount)

        // If a transfer was neither bonded nor withdrawn, log it
        console.log(`transfer ${transferId} was not bonded, not withdrawn, or bonded with incorrect parameters (which produced an incorrect transferId)`)
      }
    }

    if (!totalAmountBn.eq(calcAmountBn)) {
      const diff = (totalAmountBn.sub(calcAmountBn))
      console.log(
        `root: ${rootHash}, totalAmount: ${totalAmountBn}, calculatedAmount: ${calcAmountBn}. diff: ${diff}`
      )
    }
  }
}

async function getTransfersCommitted (
  token: string,
  chain: string,
  destinationChainId: number
): Promise<TransferCommitted[]> {
  const query = getTransfersCommittedsQuery(token)
  const transfersCommittedRes = await makeRequest(chain, query, {
    token,
    destinationChainId: destinationChainId.toString()
  })
  return transfersCommittedRes.transfersCommitteds
}

async function getMultipleWithdrawalsSettled (
  destinationChain: string,
  rootHash: string
): Promise<MultipleWithdrawalsSettled[]> {
  const query = getMultipleWithdrawalsSettledsQuery()
  const multipleWithdrawalsSettledRes = await makeRequest(destinationChain, query, {
    rootHash
  })
  return multipleWithdrawalsSettledRes.multipleWithdrawalsSettleds
}

async function getTransferSent (
  token: string,
  chain: string,
  destinationChainId: number,
  startBlockNumber: string,
  endBlockNumber: string
): Promise<TransferSent[]> {
  const query = getTransferSentsQuery(token)
  const transferSentRes = await makeRequest(chain, query, {
    token,
    startBlockNumber,
    endBlockNumber,
    destinationChainId: destinationChainId.toString()
  })
  return transferSentRes.transferSents
}

async function getWithdrew (
  destinationChain: string,
  transferId: string
): Promise<WithdrawnTransfer[]> {
  const query = getWithdrewsQuery()
  const withdrewsRes = await makeRequest(destinationChain, query, {
    transferId
  })
  return withdrewsRes.withdrews
}

async function getBondedTransfer (
  destinationChain: string,
  transferId: string
): Promise<BondedTransfer[]> {
  const query = getWithdrawalBondedsQuery()
  const withdrawalBondedsRes = await makeRequest(destinationChain, query, {
    transferId
  })
  return withdrawalBondedsRes.withdrawalBondeds
}

function getTransfersCommittedsQuery (token: string) {
  const query = `
    query TransferId(${token ? '$token: String, ' : ''}$destinationChainId: String) {
      transfersCommitteds(
        where: {
          ${token ? 'token: $token,' : ''}
          destinationChainId: $destinationChainId
        },
        orderBy: timestamp,
        orderDirection: desc,
        first: 1000
      ) {
        rootHash
        totalAmount
        blockNumber
        transactionIndex
      }
    }
  `

  return query
}

function getMultipleWithdrawalsSettledsQuery () {
  const query = `
    query Settled($rootHash: String) {
      multipleWithdrawalsSettleds(
        where: {
          rootHash: $rootHash
        }
      ) {
        totalBondsSettled
      }
    }
  `

  return query
}

function getTransferSentsQuery (
  token: string
) {
  const query = `
    query TransferSent(${token ? '$token: String, ' : ''}$destinationChainId: String, $startBlockNumber: String, $endBlockNumber: String, $startTransactionIndex: String, $endTransactionIndex: String) {
      transferSents(
        where: {
          ${token ? 'token: $token,' : ''}
          destinationChainId: $destinationChainId
          blockNumber_gte: $startBlockNumber
          blockNumber_lte: $endBlockNumber
        },
        orderBy: timestamp,
        orderDirection: desc,
        first: 1000
      ) {
        transferId
        amount
        transactionIndex
        blockNumber
      }
    }
  `

  return query
}

function getWithdrewsQuery () {
  const query = `
    query Withdrew($transferId: String) {
      withdrews(
        where: {
          transferId: $transferId
        }
      ) {
        amount
      }
    }
  `

  return query
}

function getWithdrawalBondedsQuery () {
  const query = `
    query WithdrawalBonded($transferId: String) {
      withdrawalBondeds(
        where: {
          transferId: $transferId
        }
      ) {
        amount
      }
    }
  `

  return query
}
