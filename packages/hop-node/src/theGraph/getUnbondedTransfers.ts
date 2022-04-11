import chainIdToSlug from 'src/utils/chainIdToSlug'
import getTokenDecimals from 'src/utils/getTokenDecimals'
import makeRequest from './makeRequest'
import { Chain } from 'src/constants'
import { DateTime } from 'luxon'
import { chunk, uniqBy } from 'lodash'
import { formatUnits } from 'ethers/lib/utils'
import { padHex } from 'src/utils/padHex'

export async function getUnbondedTransfers (days: number, offsetDays: number = 0) {
  const endDate = DateTime.now().toUTC()
  const startTime = Math.floor(endDate.minus({ days: days + offsetDays }).startOf('day').toSeconds())
  const endTime = Math.floor(endDate.minus({ days: offsetDays }).plus({ days: 2 }).toSeconds())

  const transfers = await getTransfersData(startTime, endTime)
  return transfers.filter((x: any) => !x.bonded)
}

async function getTransfersData (startTime: number, endTime: number) {
  let data: any[] = []
  const [
    gnosisTransfers,
    polygonTransfers,
    optimismTransfers,
    arbitrumTransfers,
    mainnetTransfers
  ] = await Promise.all([
    fetchTransfers(Chain.Gnosis, startTime, endTime),
    fetchTransfers(Chain.Polygon, startTime, endTime),
    fetchTransfers(Chain.Optimism, startTime, endTime),
    fetchTransfers(Chain.Arbitrum, startTime, endTime),
    fetchTransfers(Chain.Ethereum, startTime, endTime)
  ])

  for (const x of gnosisTransfers) {
    data.push({
      sourceChain: 100,
      destinationChain: x.destinationChainId,
      amount: x.amount,
      amountOutMin: x.amountOutMin,
      bonderFee: x.bonderFee,
      recipient: x.recipient,
      deadline: x.deadline,
      transferId: x.transferId,
      transactionHash: x.transactionHash,
      timestamp: Number(x.timestamp),
      token: x.token
    })
  }
  for (const x of polygonTransfers) {
    data.push({
      sourceChain: 137,
      destinationChain: x.destinationChainId,
      amount: x.amount,
      amountOutMin: x.amountOutMin,
      bonderFee: x.bonderFee,
      recipient: x.recipient,
      deadline: x.deadline,
      transferId: x.transferId,
      transactionHash: x.transactionHash,
      timestamp: Number(x.timestamp),
      token: x.token
    })
  }
  for (const x of optimismTransfers) {
    data.push({
      sourceChain: 10,
      destinationChain: x.destinationChainId,
      amount: x.amount,
      bonderFee: x.bonderFee,
      recipient: x.recipient,
      deadline: x.deadline,
      transferId: x.transferId,
      transactionHash: x.transactionHash,
      timestamp: Number(x.timestamp),
      token: x.token
    })
  }
  for (const x of arbitrumTransfers) {
    data.push({
      sourceChain: 42161,
      destinationChain: x.destinationChainId,
      amount: x.amount,
      amountOutMin: x.amountOutMin,
      bonderFee: x.bonderFee,
      recipient: x.recipient,
      deadline: x.deadline,
      transferId: x.transferId,
      transactionHash: x.transactionHash,
      timestamp: Number(x.timestamp),
      token: x.token
    })
  }
  for (const x of mainnetTransfers) {
    data.push({
      sourceChain: 1,
      destinationChain: x.destinationChainId,
      amount: x.amount,
      amountOutMin: x.amountOutMin,
      recipient: x.recipient,
      bonderFee: x.relayerFee,
      deadline: x.deadline,
      transferId: x.id,
      transactionHash: x.transactionHash,
      timestamp: Number(x.timestamp),
      token: x.token
    })
  }

  data = data.sort((a, b) => b.timestamp - a.timestamp)
  startTime = data.length ? data[data.length - 1].timestamp : 0
  endTime = data.length ? data[0].timestamp : 0

  if (startTime) {
    startTime = Math.floor(DateTime.fromSeconds(startTime).minus({ days: 1 }).toSeconds())
  }

  if (endTime) {
    endTime = Math.floor(DateTime.fromSeconds(endTime).plus({ days: 1 }).toSeconds())
  }

  const transferIds = data.map(x => x.transferId)

  const [
    gnosisBondedWithdrawals,
    polygonBondedWithdrawals,
    optimismBondedWithdrawals,
    arbitrumBondedWithdrawals,
    mainnetBondedWithdrawals
  ] = await Promise.all([
    fetchBonds(Chain.Gnosis, transferIds),
    fetchBonds(Chain.Polygon, transferIds),
    fetchBonds(Chain.Optimism, transferIds),
    fetchBonds(Chain.Arbitrum, transferIds),
    fetchBonds(Chain.Ethereum, transferIds)
  ])

  const [
    gnosisWithdrews,
    polygonWithdrews,
    optimismWithdrews,
    arbitrumWithdrews,
    mainnetWithdrews
  ] = await Promise.all([
    fetchWithdrews(Chain.Gnosis, startTime, endTime),
    fetchWithdrews(Chain.Polygon, startTime, endTime),
    fetchWithdrews(Chain.Optimism, startTime, endTime),
    fetchWithdrews(Chain.Arbitrum, startTime, endTime),
    fetchWithdrews(Chain.Ethereum, startTime, endTime)
  ])

  const [
    gnosisFromL1Completeds,
    polygonFromL1Completeds,
    optimismFromL1Completeds,
    arbitrumFromL1Completeds
  ] = await Promise.all([
    fetchTransferFromL1Completeds(Chain.Gnosis, startTime, endTime),
    fetchTransferFromL1Completeds(Chain.Polygon, startTime, endTime),
    fetchTransferFromL1Completeds(Chain.Optimism, startTime, endTime),
    fetchTransferFromL1Completeds(Chain.Arbitrum, startTime, endTime)
  ])

  const gnosisBonds = [...gnosisBondedWithdrawals, ...gnosisWithdrews]
  const polygonBonds = [...polygonBondedWithdrawals, ...polygonWithdrews]
  const optimismBonds = [...optimismBondedWithdrawals, ...optimismWithdrews]
  const arbitrumBonds = [...arbitrumBondedWithdrawals, ...arbitrumWithdrews]
  const mainnetBonds = [...mainnetBondedWithdrawals, ...mainnetWithdrews]

  const bondsMap: any = {
    gnosis: gnosisBonds,
    polygon: polygonBonds,
    optimism: optimismBonds,
    arbitrum: arbitrumBonds,
    ethereum: mainnetBonds
  }

  const l1CompletedsMap: any = {
    gnosis: gnosisFromL1Completeds,
    polygon: polygonFromL1Completeds,
    optimism: optimismFromL1Completeds,
    arbitrum: arbitrumFromL1Completeds
  }

  for (const x of data) {
    const bonds = bondsMap[chainIdToSlug(x.destinationChain)]
    if (bonds) {
      for (const bond of bonds) {
        if (bond.transferId === x.transferId) {
          x.bonded = true
          x.bonder = bond.from
          x.bondTransactionHash = bond.transactionHash
          x.bondedTimestamp = Number(bond.timestamp)
          continue
        }
      }
    }
  }

  for (const x of data) {
    const sourceChain = chainIdToSlug(x.sourceChain)
    if (sourceChain !== Chain.Ethereum) {
      continue
    }
    const events = l1CompletedsMap[chainIdToSlug(x.destinationChain)]
    if (events) {
      for (const event of events) {
        if (
          event.recipient === x.recipient &&
          event.amount === x.amount &&
          event.amountOutMin === x.amountOutMin &&
          event.deadline === x.deadline
        ) {
          x.bonded = true
          x.bonder = event.from
          x.bondTransactionHash = event.transactionHash
          x.bondedTimestamp = Number(event.timestamp)
          continue
        }
      }
    }
  }

  const unbondableTransfers = [
    '0xf78b17ccced6891638989a308cc6c1f089330cd407d8c165ed1fbedb6bda0930',
    '0x5a37e070c256e37504116e351ec3955679539d6aa3bd30073942b17afb3279f4',
    '0x185b2ba8f589119ede69cf03b74ee2b323b23c75b6b9f083bdf6123977576790',
    '0x0131496b64dbd1f7821ae9f7d78f28f9a78ff23cd85e8851b8a2e4e49688f648'
  ]

  const populatedData = data
    .filter(x => x.destinationChain && x.transferId)
    .filter(x => {
      return !unbondableTransfers.includes(x.transferId)
    })
    .map(populateTransfer)
    .sort((a: any, b: any) => b.timestamp - a.timestamp)
    .map((x: any, i: number) => {
      x.index = i
      return x
    })

  return populatedData
}

export async function fetchTransfers (chain: Chain, startTime: number, endTime: number) {
  const queryL1 = `
    query TransferSentToL2($startTime: Int, $endTime: Int) {
      transferSents: transferSentToL2S(
        where: {
          timestamp_gte: $startTime,
          timestamp_lte: $endTime
        },
        first: 1000,
        orderBy: timestamp,
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
      }
    }
  `
  const queryL2 = `
    query TransferSents($startTime: Int, $endTime: Int) {
      transferSents(
        where: {
          timestamp_gte: $startTime,
          timestamp_lte: $endTime
        },
        first: 1000,
        orderBy: timestamp,
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
      }
    }
  `
  let query = queryL1
  if (chain !== Chain.Ethereum) {
    query = queryL2
  }
  const data = await makeRequest(chain, query, {
    startTime,
    endTime
  })

  let transfers = data.transferSents
    .filter((x: any) => x)
    .map((x: any) => {
      x.destinationChainId = Number(x.destinationChainId)
      return x
    })

  if (transfers.length > 0) {
    try {
      const lastTimestamp = Number(transfers[transfers.length - 1].timestamp)
      if (startTime === lastTimestamp) {
        return transfers
      }
      startTime = lastTimestamp
      transfers = transfers.concat(...(await fetchTransfers(
        chain,
        startTime,
        endTime
      )))
    } catch (err: any) {
      if (!err.message.includes('The `skip` argument must be between')) {
        throw err
      }
    }
  }

  return uniqBy(transfers, (x: any) => x.id)
}

async function fetchBonds (chain: Chain, transferIds: string[]) {
  const query = `
    query WithdrawalBondeds($transferIds: [String]) {
      withdrawalBondeds: withdrawalBondeds(
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
  const chunkSize = 1000
  const allChunks = chunk(transferIds, chunkSize)
  let bonds: any = []
  for (const _transferIds of allChunks) {
    const data = await makeRequest(chain, query, {
      transferIds: _transferIds
    })

    bonds = bonds.concat(data.withdrawalBondeds)
  }

  return bonds
}

async function fetchWithdrews (chain: Chain, startTime: number, endTime: number, transferIds?: string[], skip?: number) {
  const query = `
    query Withdrews($perPage: Int, $startTime: Int, $endTime: Int, $transferId: String) {
      withdrews(
        where: {
          ${transferIds ? 'transferId_in: $transferIds' : 'timestamp_gte: $startTime, timestamp_lte: $endTime'}
        },
        first: $perPage,
        orderBy: timestamp,
        orderDirection: desc,
        skip: $skip
      ) {
        id
        transferId
        transactionHash
        timestamp
        token
      }
    }
  `
  if (!skip) {
    skip = 0
  }
  const data = await makeRequest(chain, query, {
    perPage: 1000,
    startTime,
    endTime,
    transferIds,
    skip
  })
  let withdrawals = data.withdrews || []

  if (withdrawals.length === 1000) {
    try {
      withdrawals = withdrawals.concat(...(await fetchWithdrews(
        chain,
        startTime,
        endTime,
        transferIds,
        skip + 1000
      )))
    } catch (err: any) {
      if (!err.message.includes('The `skip` argument must be between')) {
        throw err
      }
    }
  }

  return withdrawals
}

async function fetchTransferFromL1Completeds (chain: Chain, startTime: number, endTime: number, skip?: number) {
  const query = `
    query TransferFromL1Completed($perPage: Int, $startTime: Int, $endTime: Int, $skip: Int) {
      events: transferFromL1Completeds(
        where: {
          timestamp_gte: $startTime,
          timestamp_lte: $endTime
        },
        first: $perPage,
        orderBy: timestamp,
        orderDirection: desc,
        skip: $skip
      ) {
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

  if (!skip) {
    skip = 0
  }
  const data = await makeRequest(chain, query, {
    perPage: 1000,
    startTime,
    endTime,
    skip
  })

  let events = data.events || []
  if (events.length === 1000) {
    try {
      events = events.concat(...(await fetchTransferFromL1Completeds(
        chain,
        startTime,
        endTime,
        skip + 1000
      )))
    } catch (err: any) {
      if (!err.message.includes('The `skip` argument must be between')) {
        throw err
      }
    }
  }

  return events
}

function populateTransfer (x: any, i: number) {
  x.timestamp = Number(x.timestamp)
  const transferTime = DateTime.fromSeconds(x.timestamp)
  x.sourceChainSlug = chainIdToSlug(x.sourceChain)
  x.destinationChainSlug = chainIdToSlug(x.destinationChain)
  x.receiveStatusUnknown = x.sourceChain === 1 && !x.bonded && DateTime.now().toSeconds() > transferTime.toSeconds() + (60 * 60 * 5)

  const decimals = getTokenDecimals(x.token)
  x.formattedAmount = Number(formatUnits(x.amount, decimals))
  x.formattedBonderFee = x.bonderFee ? Number(formatUnits(x.bonderFee, decimals)) : 0

  return x
}
