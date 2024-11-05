import fetch from 'isomorphic-fetch'
import { cctpDomainToChainId } from './utils/cctpDomainToChainId'
import { chainSlugToId } from './utils/chainSlugToId'
import { chunk } from 'lodash'
import { getSubgraphUrl } from './utils/getSubgraphUrl'
import { getSupportedCctpChains } from './utils/getSupportedCctpChains'
import { padHex } from './utils/padHex'
import { promiseTimeout } from './utils/promiseTimeout'

type QueryFetchVariables = any

export async function queryFetch (url: string, query: string, variables?: QueryFetchVariables) {
  return promiseTimeout(_queryFetch(url, query, variables), 60 * 1000)
}

export async function _queryFetch (url: string, query: string, variables?: QueryFetchVariables) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      query,
      variables: variables || {}
    })
  })
  const jsonRes = await res.json()
  if (jsonRes.errors?.length) {
    console.log('error query:', query, variables, url)
    throw new Error(jsonRes.errors[0].message)
  }

  // console.log("----THEGRAPHLOG----", url, query.replace(/\n/gi, '').substr(0, 50), JSON.stringify(variables ?? {}).substring(0, 50))

  if (!jsonRes.data) {
    console.log(jsonRes)
  }

  return jsonRes.data
}

export async function fetchTransferSents (chain: string, startTime: number, endTime: number, lastId?: string) {
  try {
    const queryL1 = `
      query TransferSentToL2($perPage: Int, $startTime: Int, $endTime: Int, $lastId: String) {
        transferSents: transferSentToL2S(
          where: {
            timestamp_gte: $startTime,
            timestamp_lte: $endTime,
            id_gt: $lastId
          },
          first: $perPage,
          orderBy: id,
          orderDirection: asc
        ) {
          id
          destinationChainId
          amount
          amountOutMin
          relayerFee
          recipient
          deadline
          transactionHash
          timestamp
          token
          from
          relayer
          relayerFee
          transaction {
            to
          }
        }
      }
    `
    const queryL2 = `
      query TransferSents($perPage: Int, $startTime: Int, $endTime: Int, $lastId: String) {
        transferSents(
          where: {
            timestamp_gte: $startTime,
            timestamp_lte: $endTime,
            id_gt: $lastId
          },
          first: $perPage,
          orderBy: id,
          orderDirection: asc
        ) {
          id
          transferId
          destinationChainId
          amount
          amountOutMin
          bonderFee
          recipient
          deadline
          transactionHash
          timestamp
          token
          from
          transaction {
            to
          }
        }
      }
    `
    let url :string
    try {
      url = getSubgraphUrl(chain)
      console.log(chain, url)
    } catch (err) {
      return []
    }
    let query = queryL1
    if (chain !== 'ethereum') {
      query = queryL2
    }
    if (!lastId) {
      lastId = '0'
    }
    const data = await queryFetch(url, query, {
      perPage: 1000,
      startTime,
      endTime,
      lastId
    })

    let transfers = data.transferSents
      .filter((x: any) => x)
      .map((x: any) => {
        x.destinationChainId = Number(x.destinationChainId)
        return x
      })

    if (transfers.length === 1000) {
      lastId = transfers[transfers.length - 1].id
      transfers = transfers.concat(...(await fetchTransferSents(
        chain,
        startTime,
        endTime,
        lastId
      )))
    }

    return transfers
  } catch (err) {
    console.error('fetchTransferSents error', chain, err)
    return []
  }
}

export async function fetchTransferSentsForTransferId (chain: string, transferId: string) {
  try {
    const queryL1TransferId = `
      query TransferSentToL2ForTransferId($transferId: String) {
        transferSents: transferSentToL2S(
          where: {
            id: $transferId
          }
        ) {
          id
          destinationChainId
          amount
          amountOutMin
          relayerFee
          recipient
          deadline
          transactionHash
          timestamp
          token
          from
          transaction {
            to
          }
        }
      }
    `
    const queryL1TxHash = `
      query TransferSentToL2ForTransferId($transferId: String) {
        transferSents: transferSentToL2S(
          where: {
            transactionHash: $transferId
          }
        ) {
          id
          destinationChainId
          amount
          amountOutMin
          relayerFee
          recipient
          deadline
          transactionHash
          timestamp
          token
          from
          transaction {
            to
          }
        }
      }
    `
    const queryL2 = `
      query TransferSentsForTransferId($transferId: String) {
        transferSents: transferSents(
          where: {
            transferId: $transferId
          }
        ) {
          id
          transferId
          destinationChainId
          amount
          amountOutMin
          bonderFee
          recipient
          deadline
          transactionHash
          timestamp
          token
          from
          transaction {
            to
          }
        },
        transferSents2: transferSents(
          where: {
            transactionHash: $transferId
          }
        ) {
          id
          transferId
          destinationChainId
          amount
          amountOutMin
          bonderFee
          recipient
          deadline
          transactionHash
          timestamp
          token
          from
          transaction {
            to
          }
        }
      }
    `
    let url :string
    try {
      url = getSubgraphUrl(chain)
    } catch (err) {
      return []
    }
    let query = transferId.length === 66 ? queryL1TxHash : queryL1TransferId
    if (chain !== 'ethereum') {
      transferId = padHex(transferId)
      query = queryL2
    }
    const data = await queryFetch(url, query, {
      transferId
    })

    const transfers = data.transferSents.concat(data.transferSents2 || [])
      .filter((x: any) => x)
      .map((x: any) => {
        x.destinationChainId = Number(x.destinationChainId)
        return x
      })

    return transfers
  } catch (err) {
    console.error('fetchTransferSentsForTransferId error', chain, err)
    return []
  }
}

export async function fetchBondTransferIdEvents (chain: string, startTime: number, endTime: number, lastId?: string) {
  try {
    const query = `
      query WithdrawalBondedsTransferIdEvents($perPage: Int, $startTime: Int, $endTime: Int, $lastId: String) {
        withdrawalBondeds: withdrawalBondeds(
          where: {
            timestamp_gte: $startTime,
            timestamp_lte: $endTime,
            id_gt: $lastId
          },
          first: $perPage,
          orderBy: id,
          orderDirection: asc
        ) {
          id
          transferId
          transactionHash
          timestamp
          token
          from
        }
      }
    `

    let url :string
    try {
      url = getSubgraphUrl(chain)
    } catch (err) {
      return []
    }
    if (!lastId) {
      lastId = '0'
    }
    const data = await queryFetch(url, query, {
      perPage: 1000,
      startTime,
      endTime,
      lastId
    })

    let bonds = data.withdrawalBondeds.filter((x: any) => x)

    if (bonds.length === 1000) {
      lastId = bonds[bonds.length - 1].id
      bonds = bonds.concat(...(await fetchBondTransferIdEvents(
        chain,
        startTime,
        endTime,
        lastId
      )))
    }

    return bonds
  } catch (err) {
    console.error('fetchBondTransferIdEvents error', chain, err)
    return []
  }
}

export async function fetchTransferBonds (chain: string, transferIds: string[]) {
  try {
    const query = `
      query WithdrawalBondeds($transferIds: [String]) {
        withdrawalBondeds1: withdrawalBondeds(
          where: {
            transferId_in: $transferIds
          },
          first: 1000,
          orderBy: id,
          orderDirection: asc
        ) {
          id
          transferId
          transactionHash
          timestamp
          token
          from
        },
        withdrawalBondeds2: withdrawalBondeds(
          where: {
            transactionHash_in: $transferIds
          },
          first: 1000,
          orderBy: id,
          orderDirection: asc,
        ) {
          id
          transferId
          transactionHash
          timestamp
          token
          from
        }
      }
    `

    transferIds = transferIds?.filter(x => x).map((x: string) => padHex(x)) ?? []
    let url :string
    try {
      url = getSubgraphUrl(chain)
    } catch (err) {
      return []
    }
    let bonds: any = []
    const chunkSize = 1000
    const allChunks = chunk(transferIds, chunkSize)
    for (const _transferIds of allChunks) {
      const data = await queryFetch(url, query, {
        transferIds: _transferIds
      })

      bonds = bonds.concat((data.withdrawalBondeds1 || []).concat(data.withdrawalBondeds2 || []))
    }

    return bonds
  } catch (err) {
    console.error('fetchTransferBonds error', chain, err)
    return []
  }
}

export async function fetchWithdrewTransferIdEvents (chain: string, startTime: number, endTime: number, lastId?: string) {
  try {
    const query = `
      query WithdrewTransferIdEvents($perPage: Int, $startTime: Int, $endTime: Int, $lastId: String) {
        withdrews: withdrews(
          where: {
            timestamp_gte: $startTime,
            timestamp_lte: $endTime,
            id_gt: $lastId
          },
          first: $perPage,
          orderBy: id,
          orderDirection: asc
        ) {
          id
          transferId
          transactionHash
          timestamp
          token
          from
        }
      }
    `

    let url :string
    try {
      url = getSubgraphUrl(chain)
    } catch (err) {
      return []
    }
    if (!lastId) {
      lastId = '0'
    }
    const data = await queryFetch(url, query, {
      perPage: 1000,
      startTime,
      endTime,
      lastId
    })

    let bonds = data.withdrews.filter((x: any) => x)

    if (bonds.length === 1000) {
      lastId = bonds[bonds.length - 1].id
      bonds = bonds.concat(...(await fetchWithdrewTransferIdEvents(
        chain,
        startTime,
        endTime,
        lastId
      )))
    }

    return bonds
  } catch (err) {
    console.error(err)
    return []

  }
}

export async function fetchWithdrews (chain: string, transferIds: string[]) {
  try {
    const query = `
      query Withdrews($transferIds: [String]) {
        withdrews(
          where: {
            transferId_in: $transferIds
          },
          first: 1000,
          orderBy: id,
          orderDirection: asc
        ) {
          id
          transferId
          transactionHash
          timestamp
          token
          from
        }
      }
    `
    transferIds = transferIds?.filter(x => x).map((x: string) => padHex(x)) ?? []
    let url :string
    try {
      url = getSubgraphUrl(chain)
    } catch (err) {
      return []
    }
    let withdrawals: any = []
    const chunkSize = 1000
    const allChunks = chunk(transferIds, chunkSize)
    for (const _transferIds of allChunks) {
      const data = await queryFetch(url, query, {
        transferIds: _transferIds
      })

      withdrawals = withdrawals.concat(data.withdrews)
    }

    return withdrawals
  } catch (err) {
    console.error('fetchWithdrews error', chain, err)
    return []
  }
}

export async function fetchTransferFromL1Completeds (chain: string, startTime: number, endTime: number, lastId = '0') {
  try {
    const query = `
      query TransferFromL1Completed($startTime: Int, $endTime: Int, $lastId: ID) {
        events: transferFromL1Completeds(
          where: {
            timestamp_gte: $startTime,
            timestamp_lte: $endTime,
            id_gt: $lastId
          },
          first: 1000,
          orderBy: id,
          orderDirection: asc
        ) {
          id
          recipient
          amount
          amountOutMin
          deadline
          transactionHash
          from
          timestamp
        }
      }
    `

    let url :string
    try {
      url = getSubgraphUrl(chain)
    } catch (err) {
      return []
    }
    const data = await queryFetch(url, query, {
      startTime,
      endTime,
      lastId
    })
    let events = data.events || []

    if (events.length === 1000) {
      lastId = events[events.length - 1].id
      events = events.concat(...(await fetchTransferFromL1Completeds(
        chain,
        startTime,
        endTime,
        lastId
      )))
    }

    return events
  } catch (err) {
    console.error('fetchTransferFromL1Completeds error', chain, err)
    return []
  }
}

export async function fetchTransferFromL1CompletedsByRecipient (chain: string, recipient: string) {
  try {
    const query = `
      query TransferFromL1CompletedByRecipient($recipient: String) {
        events: transferFromL1Completeds(
          where: {
            recipient: $recipient
          },
          first: 1000,
          orderBy: id,
          orderDirection: desc
        ) {
          id
          recipient
          amount
          amountOutMin
          deadline
          transactionHash
          from
          timestamp
        }
      }
    `

    let url :string
    try {
      url = getSubgraphUrl(chain)
    } catch (err) {
      return []
    }
    const data = await queryFetch(url, query, {
      recipient
    })
    const events = data.events || []

    return events
  } catch (err) {
    console.error('fetchTransferFromL1CompletedsByRecipient error', chain, err)
    return []
  }
}

export async function fetchTransferEventsByTransferIds (chain: string, transferIds: string[]) {
  try {
    if (chain === 'mainnet' || chain === 'ethereum') {
      return []
    }
    const query = `
      query TransferSentsByTransferIds($transferIds: [String]) {
        transferSents: transferSents(
          where: {
            transferId_in: $transferIds
          },
          first: 1000,
          orderBy: id,
          orderDirection: asc
        ) {
          id
          transferId
          destinationChainId
          amount
          amountOutMin
          bonderFee
          recipient
          deadline
          transactionHash
          timestamp
          token
          from
          transaction {
            to
          }
        }
      }
    `

    transferIds = transferIds?.filter(x => x).map((x: string) => padHex(x)) ?? []
    let url :string
    try {
      url = getSubgraphUrl(chain)
    } catch (err) {
      return []
    }
    let transferSents: any = []
    const chunkSize = 1000
    const allChunks = chunk(transferIds, chunkSize)
    for (const _transferIds of allChunks) {
      const data = await queryFetch(url, query, {
        transferIds: _transferIds
      })

      transferSents = transferSents.concat(data.transferSents || [])
    }

    return transferSents.filter((x: any) => x)
  } catch (err) {
    console.error('fetchTransferEventsByTransferIds error', chain, err)
    return []
  }
}

export async function fetchCctpTransferSents (chain: string, startTime: number, endTime: number, lastId?: string) {
  try {
    const supportedChains = getSupportedCctpChains()
    if (!supportedChains.includes(chain)) {
      return []
    }

    const query = `
      query CctpTransferSents($perPage: Int, $startTime: Int, $endTime: Int, $lastId: String) {
        cctptransferSents(
          where: {
            block_: {
              timestamp_gte: $startTime,
              timestamp_lte: $endTime,
            },
            id_gt: $lastId
          },
          first: $perPage,
          orderBy: id,
          orderDirection: asc
        ) {
          id
          cctpNonce
          chainId
          recipient
          amount
          bonderFee
          transaction {
            to
            hash
            from
          }
          block {
            timestamp
          }
        }
      }
    `
    let url :string
    try {
      url = getSubgraphUrl(chain)
      console.log(chain, url)
    } catch (err) {
      return []
    }
    if (!lastId) {
      lastId = '0'
    }
    const data = await queryFetch(url, query, {
      perPage: 1000,
      startTime,
      endTime,
      lastId
    })

    let transfers = data.cctptransferSents
      .filter((x: any) => x)
      .map((x: any) => {
        x.chainId = Number(x.chainId)
        x.destinationChain = x.chainId
        x.destinationChainId = x.chainId
        x.sourceChainId = chainSlugToId(chain)
        x.transferId = `${x.cctpNonce}`
        x.token = 'USDC'
        x.isCctp = true
        return x
      })

    if (transfers.length === 1000) {
      lastId = transfers[transfers.length - 1].id
      transfers = transfers.concat(...(await fetchCctpTransferSents(
        chain,
        startTime,
        endTime,
        lastId
      )))
    }

    return transfers
  } catch (err) {
    console.error('fetchCctpTransferSents error', chain, err)
    return []
  }
}

export async function fetchCctpTransferSentsForTxHash (chain: string, txHash: string) {
  try {
    const supportedChains = getSupportedCctpChains()
    if (!supportedChains.includes(chain)) {
      return []
    }

    if (!txHash?.startsWith('0x')) {
      return []
    }

    const query = `
      query CctpTransferSentsForTxHash($txHash: String) {
        cctptransferSents: cctptransferSents(
          where: {
            transaction_: {
              hash: $txHash,
            }
          },
        ) {
          id
          cctpNonce
          chainId
          recipient
          amount
          bonderFee
          transaction {
            to
            hash
            from
          }
          block {
            timestamp
          }
        }
      }
    `
    let url :string
    try {
      url = getSubgraphUrl(chain)
    } catch (err) {
      return []
    }
    const data = await queryFetch(url, query, {
      txHash
    })

    const transfers = data.cctptransferSents
      .filter((x: any) => x)
      .map((x: any) => {
        x.chainId = Number(x.chainId)
        x.destinationChain = x.chainId
        x.destinationChainId = x.chainId
        x.sourceChainId = chainSlugToId(chain)
        x.transferId = `${x.cctpNonce}`
        x.token = 'USDC'
        x.isCctp = true
        return x
      })

    return transfers
  } catch (err) {
    console.error('fetchCctpTransferSentsForTxHash error', chain, err)
    return []
  }
}

export async function fetchCctpTransferSentsForTransferId (chain: string, transferId: string) {
  try {
    if (transferId.length === 66) {
      return await fetchCctpTransferSentsForTxHash(chain, transferId)
    }

    const supportedChains = ['ethereum', 'arbitrum', 'optimism', 'polygon', 'base']
    if (!supportedChains.includes(chain)) {
      return []
    }

    if (transferId?.startsWith('0x')) {
      return []
    }

    const query = `
      query CctpTransferSentsForTransferId($cctpNonce: String) {
        cctptransferSents: cctptransferSents(
          where: {
            cctpNonce: $cctpNonce
          },
        ) {
          id
          cctpNonce
          chainId
          recipient
          amount
          bonderFee
          transaction {
            to
            hash
            from
          }
          block {
            timestamp
          }
        }
      }
    `
    let url :string
    try {
      url = getSubgraphUrl(chain)
    } catch (err) {
      return []
    }
    const data = await queryFetch(url, query, {
      cctpNonce: transferId
    })

    const transfers = data.cctptransferSents
      .filter((x: any) => x)
      .map((x: any) => {
        x.chainId = Number(x.chainId)
        x.destinationChain = x.chainId
        x.destinationChainId = x.chainId
        x.sourceChainId = chainSlugToId(chain)
        x.transferId = `${x.cctpNonce}`
        x.token = 'USDC'
        x.isCctp = true
        return x
      })

    return transfers
  } catch (err) {
    console.error('fetchCctpTransferSentsForTransferId error', chain, err)
    return []
  }
}

export async function fetchCctpTransferSentsByTransferIds (chain: string, transferIds: string[]) {
  try {
    const supportedChains = getSupportedCctpChains()
    if (!supportedChains.includes(chain)) {
      return []
    }

    const query = `
      query CctpTransferSentsByTransferIds($transferIds: [String]) {
        cctptransferSents: cctptransferSents(
          where: {
            cctpNonce_in: $transferIds
          },
          first: 1000,
          orderBy: id,
          orderDirection: asc
        ) {
          id
          cctpNonce
          chainId
          recipient
          amount
          bonderFee
          transaction {
            to
            hash
            from
          }
          block {
            timestamp
          }
        }
      }
    `

    let url :string
    try {
      url = getSubgraphUrl(chain)
    } catch (err) {
      return []
    }
    let transferSents: any = []
    const chunkSize = 1000
    const allChunks = chunk(transferIds.filter(x => !x.startsWith('0x')), chunkSize)
    for (const chunkedTransferIds of allChunks) {
      const data = await queryFetch(url, query, {
        transferIds: chunkedTransferIds
      })

      transferSents = transferSents.concat(data.cctptransferSents || [])
    }

    return transferSents.filter(Boolean).map((x: any) => {
      x.token = 'USDC'
      x.chainId = Number(x.chainId)
      x.destinationChain = x.chainId
      x.destinationChainId = x.chainId
      x.sourceChainId = chainSlugToId(chain)
      x.transferId = `${x.cctpNonce}`
      x.isCctp = true
      return x
    })
  } catch (err) {
    console.error('fetchCctpTransferSentsByTransferIds error', chain, err)
    return []
  }
}

export async function fetchCctpMessageReceivedsByTxHashes (chain: string, txHashes: string[]) {
  try {
    const supportedChains = getSupportedCctpChains()
    if (!supportedChains.includes(chain)) {
      return []
    }

    const query = `
      query CctpMessageReceivedsByTxHashes($txHashes: [String]) {
        cctpmessageReceiveds: cctpmessageReceiveds(
          where: {
            transaction_: {
              hash_in: $txHashes
            }
          },
          first: 1000,
          orderBy: id,
          orderDirection: asc,
        ) {
          id
          address
          sourceDomain
          nonce
          sender
          messageBody
          transaction {
            to
            hash
            from
          }
          block {
            timestamp
          }
        }
      }
    `

    let url :string
    try {
      url = getSubgraphUrl(chain)
    } catch (err) {
      return []
    }
    let bonds: any = []
    const chunkSize = 1000
    const allChunks = chunk(txHashes.filter(x => x.startsWith('0x')), chunkSize)
    for (const chunkedTxHashes of allChunks) {
      const data = await queryFetch(url, query, {
        txHashes: chunkedTxHashes
      })

      bonds = data.cctpmessageReceiveds
    }

    bonds = bonds.map((x: any) => {
      x.token = 'USDC'
      x.isCctp = true
      x.transferId = `${x.nonce}`
      x.sourceChainId = cctpDomainToChainId(x.sourceDomain)
      x.destinationChainId = chainSlugToId(chain)
      return x
    })

    return bonds
  } catch(err) {
    console.error('fetchCctpMessageReceivedsByTxHashes error', chain, err)
    return []
  }
}

export async function fetchCctpMessageReceivedsByTransferIds (chain: string, transferIds: string[]) {
  try {
    const supportedChains = getSupportedCctpChains()
    if (!supportedChains.includes(chain)) {
      return []
    }

    const query = `
      query CctpMessageReceivedsByTransferIds($transferIds: [String]) {
        cctpmessageReceiveds: cctpmessageReceiveds(
          where: {
            nonce_in: $transferIds
          },
          first: 1000,
          orderBy: id,
          orderDirection: asc,
        ) {
          id
          address
          sourceDomain
          nonce
          sender
          messageBody
          transaction {
            to
            hash
            from
          }
          block {
            timestamp
          }
        }
      }
    `

    let url :string
    try {
      url = getSubgraphUrl(chain)
    } catch (err) {
      return []
    }
    let bonds: any = []
    const chunkSize = 1000
    const allChunks = chunk(transferIds.filter(x => !x.startsWith('0x')), chunkSize)
    for (const chunkedTransferIds of allChunks) {
      const data = await queryFetch(url, query, {
        transferIds: chunkedTransferIds
      })

      bonds = data.cctpmessageReceiveds
    }

    bonds = bonds.map((x: any) => {
      x.token = 'USDC'
      x.isCctp = true
      x.transferId = `${x.nonce}`
      x.sourceChainId = cctpDomainToChainId(x.sourceDomain)
      x.destinationChainId = chainSlugToId(chain)
      return x
    })

    return bonds
  } catch(err) {
    console.error('fetchCctpMessageReceivedsByTransferIds error', chain, err)
    return []
  }
}

export async function fetchCctpMessageReceivedEvents (chain: string, startTime: number, endTime: number, lastId?: string) {
  try {
    const supportedChains = getSupportedCctpChains()
    if (!supportedChains.includes(chain)) {
      return []
    }

    const query = `
      query CctpMessageReceivedsEvents($perPage: Int, $startTime: Int, $endTime: Int, $lastId: String) {
        cctpmessageReceiveds: cctpmessageReceiveds(
          where: {
            block_: {
              timestamp_gte: $startTime,
              timestamp_lte: $endTime
            },
            id_gt: $lastId
          },
          first: $perPage,
          orderBy: id,
          orderDirection: asc
        ) {
          id
          address
          sourceDomain
          nonce
          sender
          messageBody
          transaction {
            to
            hash
            from
          }
          block {
            timestamp
          }
        }
      }
    `

    let url :string
    try {
      url = getSubgraphUrl(chain)
    } catch (err) {
      return []
    }
    if (!lastId) {
      lastId = '0'
    }
    const data = await queryFetch(url, query, {
      perPage: 1000,
      startTime,
      endTime,
      lastId
    })

    let bonds = data.cctpmessageReceiveds.filter((x: any) => x)

    if (bonds.length === 1000) {
      lastId = bonds[bonds.length - 1].id
      bonds = bonds.concat(...(await fetchCctpMessageReceivedEvents(
        chain,
        startTime,
        endTime,
        lastId
      )))
    }

    bonds = bonds.map((x: any) => {
      x.transferId = `${x.nonce}`
      x.sourceChainId = cctpDomainToChainId(x.sourceDomain)
      x.destinationChainId = chainSlugToId(chain)
      x.token = 'USDC'
      x.isCctp = true
      return x
    })

    return bonds
  } catch(err) {
    console.error('fetchMessageReceivedEvents error', chain, err)
    return []
  }
}
