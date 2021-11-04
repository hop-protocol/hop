import chainSlugToId from 'src/utils/chainSlugToId'
import makeRequest from './makeRequest'
import { BigNumber } from 'ethers'

type TransferCommitted = {
  blockNumber: string
  rootHash: string
  totalAmount: string
}

type MultipleWithdrawalsSettled = {
  totalBondsSettled: string
}

type TransferSent = {
  transferId: string
}

type WithdrawnTransfer = {
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
    const { rootHash, totalAmount, blockNumber } = transfersCommitted[i]
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

    const startBlockNumber = (transfersCommitted[i + 1].blockNumber).toString()
    const endBlockNumber = blockNumber.toString()
    const transferSent: TransferSent[] = await getTransferSent(
      token,
      chain,
      destinationChainId,
      startBlockNumber,
      endBlockNumber
    )

    // Add any transfers that were completed using `withdraw()`
    for (let j = 0; j < transferSent.length; j++) {
      const { transferId } = transferSent[j]
      const withdrawnTransfer: WithdrawnTransfer[] = await getWithdrew(
        destinationChain,
        transferId
      )
      if (withdrawnTransfer.length === 0) {
        continue
      }
      const amount = withdrawnTransfer[0].amount
      calcAmountBn = calcAmountBn.add(amount)
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
    query TransferSent(${token ? '$token: String, ' : ''}$destinationChainId: String, $startBlockNumber: String, $endBlockNumber: String) {
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
      }
    }
  `

return query
}

function getWithdrewsQuery() {
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
