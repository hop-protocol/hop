import chainSlugToId from 'src/utils/chainSlugToId'
import makeRequest from './makeRequest'
import { BigNumber } from 'ethers'

export default async function getIncompleteSettlements (chain: string, token: string, destinationChain: string): Promise<any> {
  const destinationChainId: number = chainSlugToId(destinationChain)

  let query = getTransfersCommittedsQuery(token)
  const transfersCommittedRes = await makeRequest(chain, query, {
    token,
    destinationChainId: destinationChainId.toString()
  })
  const transfersCommitted = transfersCommittedRes.transfersCommitteds
  if (!transfersCommitted) {
    throw new Error('There are no committed transfers')
  }

  for (let i = 0; i < transfersCommitted.length; i++) {
    const { rootHash, totalAmount } = transfersCommitted[i]
    const totalAmountBn: BigNumber = BigNumber.from(totalAmount)

    query = getMultipleWithdrawalsSettledsQuery()
    const multipleWithdrawalsSettledRes = await makeRequest(destinationChain, query, {
      rootHash
    })
    const multipleWithdrawalsSettled = multipleWithdrawalsSettledRes.multipleWithdrawalsSettleds
    if (!multipleWithdrawalsSettled) {
      console.log(`No settlements for ${rootHash}`)
      continue
    }

    let calcAmountBn: BigNumber = BigNumber.from(0)
    for (let j = 0; j < multipleWithdrawalsSettled.length; j++) {
      const amountSettled: string = multipleWithdrawalsSettled[j].totalBondsSettled
      calcAmountBn = calcAmountBn.add(amountSettled)
    }

    if (!totalAmountBn.eq(calcAmountBn)) {
      const diff = (totalAmountBn.sub(calcAmountBn))
      console.log(
        `Root: ${rootHash}, totalAmount: ${totalAmountBn}, calcedAmt: ${calcAmountBn}. diff: ${diff}`
      )
    }
  }
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
