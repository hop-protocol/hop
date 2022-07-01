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
  const endTime = Math.floor(endDate.minus({ days: offsetDays }).plus({ days: 1 }).toSeconds())

  const transfers = await getTransfersData(startTime, endTime)
  return transfers.filter((x: any) => !x.bonded)
}

async function getTransfersData (startTime: number, endTime: number) {
  const enabledChains = [Chain.Gnosis, Chain.Polygon, Chain.Optimism, Chain.Arbitrum, Chain.Ethereum]
  console.log('getTransfersData: fetching transfers')
  let data: any[] = []
  const [
    gnosisTransfers,
    polygonTransfers,
    optimismTransfers,
    arbitrumTransfers,
    mainnetTransfers
  ] = await Promise.all([
    enabledChains.includes(Chain.Gnosis) ? fetchTransfers(Chain.Gnosis, startTime, endTime) : Promise.resolve([]),
    enabledChains.includes(Chain.Polygon) ? fetchTransfers(Chain.Polygon, startTime, endTime) : Promise.resolve([]),
    enabledChains.includes(Chain.Optimism) ? fetchTransfers(Chain.Optimism, startTime, endTime) : Promise.resolve([]),
    enabledChains.includes(Chain.Arbitrum) ? fetchTransfers(Chain.Arbitrum, startTime, endTime) : Promise.resolve([]),
    enabledChains.includes(Chain.Ethereum) ? fetchTransfers(Chain.Ethereum, startTime, endTime) : Promise.resolve([])
  ])

  console.log('getTransfersData: got transfers')

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

  console.log('getTransfersData: fetching bonds')

  const [
    gnosisBondedWithdrawals,
    polygonBondedWithdrawals,
    optimismBondedWithdrawals,
    arbitrumBondedWithdrawals,
    mainnetBondedWithdrawals
  ] = await Promise.all([
    enabledChains.includes(Chain.Gnosis) ? fetchBonds(Chain.Gnosis, transferIds) : Promise.resolve([]),
    enabledChains.includes(Chain.Polygon) ? fetchBonds(Chain.Polygon, transferIds) : Promise.resolve([]),
    enabledChains.includes(Chain.Optimism) ? fetchBonds(Chain.Optimism, transferIds) : Promise.resolve([]),
    enabledChains.includes(Chain.Arbitrum) ? fetchBonds(Chain.Arbitrum, transferIds) : Promise.resolve([]),
    enabledChains.includes(Chain.Ethereum) ? fetchBonds(Chain.Ethereum, transferIds) : Promise.resolve([])
  ])

  console.log('getTransfersData: got bonds')
  console.log('getTransfersData: fetching withdrews')

  const [
    gnosisWithdrews,
    polygonWithdrews,
    optimismWithdrews,
    arbitrumWithdrews,
    mainnetWithdrews
  ] = await Promise.all([
    enabledChains.includes(Chain.Gnosis) ? fetchWithdrews(Chain.Gnosis, transferIds) : Promise.resolve([]),
    enabledChains.includes(Chain.Polygon) ? fetchWithdrews(Chain.Polygon, transferIds) : Promise.resolve([]),
    enabledChains.includes(Chain.Optimism) ? fetchWithdrews(Chain.Optimism, transferIds) : Promise.resolve([]),
    enabledChains.includes(Chain.Arbitrum) ? fetchWithdrews(Chain.Arbitrum, transferIds) : Promise.resolve([]),
    enabledChains.includes(Chain.Ethereum) ? fetchWithdrews(Chain.Ethereum, transferIds) : Promise.resolve([])
  ])

  console.log('getTransfersData: got withdrews')
  console.log('getTransfersData: fetching L1 completeds')

  const [
    gnosisFromL1Completeds,
    polygonFromL1Completeds,
    optimismFromL1Completeds,
    arbitrumFromL1Completeds
  ] = await Promise.all([
    enabledChains.includes(Chain.Gnosis) ? fetchTransferFromL1Completeds(Chain.Gnosis, startTime, endTime) : Promise.resolve([]),
    enabledChains.includes(Chain.Polygon) ? fetchTransferFromL1Completeds(Chain.Polygon, startTime, endTime) : Promise.resolve([]),
    enabledChains.includes(Chain.Optimism) ? fetchTransferFromL1Completeds(Chain.Optimism, startTime, endTime) : Promise.resolve([]),
    enabledChains.includes(Chain.Arbitrum) ? fetchTransferFromL1Completeds(Chain.Arbitrum, startTime, endTime) : Promise.resolve([])
  ])

  console.log('getTransfersData: got L1 completeds')

  const gnosisBonds = [...gnosisBondedWithdrawals, ...gnosisWithdrews]
  const polygonBonds = [...polygonBondedWithdrawals, ...polygonWithdrews]
  const optimismBonds = [...optimismBondedWithdrawals, ...optimismWithdrews]
  const arbitrumBonds = [...arbitrumBondedWithdrawals, ...arbitrumWithdrews]
  const mainnetBonds = [...mainnetBondedWithdrawals, ...mainnetWithdrews]

  const bondsMap: any = {
    gnosis: {},
    polygon: {},
    optimism: {},
    arbitrum: {},
    ethereum: {}
  }

  for (const x of gnosisBonds) {
    bondsMap.gnosis[x.transferId] = x
  }
  for (const x of polygonBonds) {
    bondsMap.polygon[x.transferId] = x
  }
  for (const x of optimismBonds) {
    bondsMap.optimism[x.transferId] = x
  }
  for (const x of arbitrumBonds) {
    bondsMap.arbitrum[x.transferId] = x
  }
  for (const x of mainnetBonds) {
    bondsMap.ethereum[x.transferId] = x
  }

  const l1CompletedsMap: any = {
    gnosis: gnosisFromL1Completeds,
    polygon: polygonFromL1Completeds,
    optimism: optimismFromL1Completeds,
    arbitrum: arbitrumFromL1Completeds
  }

  console.log(`getTransfersData: data count: ${data.length}`)
  console.log('getTransfersData: mapping transfers to bonds')

  await Promise.all(data.map((x: any) => {
    const bonds = bondsMap[chainIdToSlug(x.destinationChain)]
    if (bonds) {
      const bond = bonds[x.transferId]
      if (bond) {
        x.bonded = true
        x.bonder = bond.from
        x.bondTransactionHash = bond.transactionHash
        x.bondedTimestamp = Number(bond.timestamp)
      }
    }
  }))

  console.log('getTransfersData: mapping events to l1CompletedsMap')

  await Promise.all(data.map((x: any) => {
    const sourceChain = chainIdToSlug(x.sourceChain)
    if (sourceChain !== Chain.Ethereum) {
      return
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
          return
        }
      }
    }
  }))

  const unbondableTransfers = [
    '0xf78b17ccced6891638989a308cc6c1f089330cd407d8c165ed1fbedb6bda0930',
    '0x5a37e070c256e37504116e351ec3955679539d6aa3bd30073942b17afb3279f4',
    '0x185b2ba8f589119ede69cf03b74ee2b323b23c75b6b9f083bdf6123977576790',
    '0x0131496b64dbd1f7821ae9f7d78f28f9a78ff23cd85e8851b8a2e4e49688f648'
  ]

  console.log('getTransfersData: populating data')

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

  console.log(`getTransfersData: got populated data. count ${populatedData.length}`)

  return populatedData
}

export async function fetchTransfers (chain: Chain, startTime: number, endTime: number) {
  let result: any[] = []
  let transfers: any[] = []
  let lastId = '0'

  do {
    transfers = await _fetchTransfers(chain, startTime, endTime, lastId)
    console.log('fetchTransfers', startTime, endTime, chain, lastId)
    if (transfers.length > 0) {
      const newLastId = transfers[transfers.length - 1].id
      if (newLastId === lastId) {
        break
      }
      lastId = newLastId
    }
    result = result.concat(...transfers)
  } while (transfers.length > 0)

  return uniqBy(result, (x: any) => x.id)
}

export async function _fetchTransfers (chain: Chain, startTime: number, endTime: number, lastId: string = '0') {
  const queryL1 = `
    query TransferSentToL2($startTime: Int, $endTime: Int, $lastId: ID) {
      transferSents: transferSentToL2S(
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
    query TransferSents($startTime: Int, $endTime: Int, $lastId: ID) {
      transferSents(
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
    endTime,
    lastId
  })

  const transfers = data.transferSents
    .filter((x: any) => x)
    .map((x: any) => {
      x.destinationChainId = Number(x.destinationChainId)
      return x
    })

  return transfers
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

async function fetchWithdrews (chain: Chain, transferIds: string[]) {
  const query = `
    query Withdrews($perPage: Int, $transferIds: [String]) {
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
      }
    }
  `

  transferIds = transferIds?.filter(x => x).map((x: string) => padHex(x)) ?? []
  const chunkSize = 1000
  const allChunks = chunk(transferIds, chunkSize)
  let withdrawals: any = []
  for (const _transferIds of allChunks) {
    const data = await makeRequest(chain, query, {
      transferIds: _transferIds
    })

    withdrawals = withdrawals.concat(data.withdrews)
  }

  return withdrawals
}

async function fetchTransferFromL1Completeds (chain: Chain, startTime: number, endTime: number, lastId: string = '0') {
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

  const data = await makeRequest(chain, query, {
    startTime,
    endTime,
    lastId
  })

  let events = data.events || []
  const maxItemsLength = 1000
  if (events.length === maxItemsLength) {
    lastId = events[events.length - 1].id
    events = events.concat(...(await fetchTransferFromL1Completeds(
      chain,
      startTime,
      endTime,
      lastId
    )))
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
