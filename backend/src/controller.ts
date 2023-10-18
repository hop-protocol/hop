import Db, { getInstance } from './Db'
import { DateTime } from 'luxon'
import Worker from './worker'
import { TransferStats } from './TransferStats'
import { formatCurrency } from './utils/formatCurrency'
import { timeToBridgeStats } from './utils/timeToBridgeStats'
import { TimeToBridgeStats } from './models/TimeToBridgeStats'
import { populateData } from './populateData'
import { cache } from './cache'
import { isGoerli } from './config'

type Transfer = {
  accountAddress: string
  amount: string
  amountDisplay: string
  amountFormatted: string
  amountOutMin: string
  amountOutMinFormatted: string
  amountReceived: string
  amountReceivedFormatted: string
  amountUsd: string
  amountUsdDisplay: string
  bondStatusColor: string
  bondTimestamp: string
  bondTimestampIso: string
  bondTransactionHash: string
  bondTransactionHashExplorerUrl: string
  bondTransactionHashTruncated: string
  bondWithinTimestamp: string
  bondWithinTimestampRelative: string
  bonded: boolean
  bonderAddress: string
  bonderAddressExplorerUrl: string
  bonderAddressTruncated: string
  bonderFee: string
  bonderFeeDisplay: string
  bonderFeeFormatted: string
  bonderFeeUsd: string
  bonderFeeUsdDisplay: string
  convertHTokenUrl: string
  deadline: string
  destinationChainColor: string
  destinationChainId: string
  destinationChainImageUrl: string
  destinationChainName: string
  destinationChainSlug: string
  hopExplorerUrl: string
  id: string
  integrationPartner: string
  preregenesis: boolean
  receivedHTokens: boolean
  recipientAddress: string
  recipientAddressExplorerUrl: string
  recipientAddressTruncated: string
  sourceChainColor: string
  sourceChainId: string
  sourceChainImageUrl: string
  sourceChainName: string
  sourceChainSlug: string
  timestamp: string
  timestampIso: string
  token: string
  tokenImageUrl: string
  tokenPriceUsd: string
  tokenPriceUsdDisplay: string
  transactionHash: string
  transactionHashExplorerUrl: string
  transactionHashTruncated: string
  transferId: string
  transferIdTruncated: string
  unbondable: boolean
  estimatedUnixTimeUntilBond: number
  estimatedSecondsUntilBond: number
  estimatedRelativeTimeUntilBond: string
}

export class Controller {
  db : Db = getInstance()
  worker: Worker

  startWorker (argv: any) {
    const worker = new Worker({
      transfers: argv.worker,
      days: argv.days,
      offsetDays: argv.offsetDays
    })

    this.worker = worker

    worker.start()
  }

  async getTransfers (params: any): Promise<Transfer[]> {
    const _key = `transfers-${Date.now()}-${Math.random()}`
    console.time(_key)
    let page = Number(params.page || 1)
    let perPage = Number(params.perPage || 100)
    const sourceChainSlug = params.sourceChainSlug
    const destinationChainSlug = params.destinationChainSlug
    const token = params.token
    const bondedStatus = params.bonded
    const bonderAddress = params.bonderAddress
    let accountAddress = params.accountAddress
    const recipientAddress = params.recipientAddress
    const amountFormatted = Number(params.amountFormatted)
    const amountFormattedCmp = params.amountFormattedCmp
    const amountUsd = Number(params.amountUsd)
    const amountUsdCmp = params.amountUsdCmp
    const bonderFeeUsd = Number(params.bonderFeeUsd)
    const bonderFeeUsdCmp = params.bonderFeeUsdCmp
    const transferId = params.transferId
    const startDate = params.startDate
    const endDate = params.endDate
    let startTimestamp = params.startTimestamp
    let endTimestamp = params.endTimestamp
    let sortBy = params.sortBy
    const sortDirection = params.sortDirection
    const countOnly = params.countOnly
    const accountsOnly = params.accountsOnly
    const receivedHTokens = params.receivedHTokens
    const refreshFlag = params.refresh
    const integrationPartner = params.integrationPartner
    let bonded : any

    if (bondedStatus === 'pending') {
      bonded = false
    }
    if (bondedStatus === 'bonded') {
      bonded = true
    }

    if (page <= 1) {
      page = 1
    }

    if (transferId) {
      page = 1
    }

    if (perPage < 0) {
      perPage = 0
    }

    if (perPage > 100) {
      perPage = 100
    }

    page = page - 1 // db page

    if (startTimestamp) {
      startTimestamp = parseInt(startTimestamp)
    }

    if (endTimestamp) {
      endTimestamp = parseInt(endTimestamp)
    }

    if (startDate) {
      startTimestamp = Math.floor(DateTime.fromFormat(startDate, 'yyyy-MM-dd').startOf('day').toUTC().toSeconds())
    }

    if (endDate) {
      endTimestamp = Math.floor(DateTime.fromFormat(endDate, 'yyyy-MM-dd').endOf('day').toUTC().toSeconds())
    }

    if (sortBy) {
      const sortBys :any = {
        amount: 'amount',
        amountUsd: 'amount_usd',
        source: 'source_chain_slug',
        destination: 'destination_chain_slug',
        account: 'account_address',
        recipient: 'recipient_address',
        bonder: 'bonder_address',
        bonded: 'bonded',
        bonderFee: 'bonder_fee',
        bonderFeeUsd: 'bonder_fee_usd',
        transferId: 'transfer_id',
        bondTimestamp: 'bond_timestamp',
        bondWithinTimestamp: 'bond_within_timestamp',
        receivedHTokens: 'received_htokens',
        token: 'token',
        integrationPartner: 'integration_partner'
      }
      sortBy = sortBys[sortBy]
    }

    if (sortDirection) {
      if (!['desc', 'asc'].includes(sortDirection)) {
        throw new Error('invalid sort direction')
      }
    }

    if (accountAddress) {
      accountAddress = accountAddress.toLowerCase()
    }

    const transfers = await this.db.getTransfers({
      page,
      perPage,
      sourceChainSlug,
      destinationChainSlug,
      token,
      bonded,
      bonderAddress,
      accountAddress,
      recipientAddress,
      amountFormatted,
      amountFormattedCmp,
      amountUsd,
      amountUsdCmp,
      bonderFeeUsd,
      bonderFeeUsdCmp,
      transferId,
      startTimestamp,
      endTimestamp,
      sortBy,
      sortDirection,
      receivedHTokens,
      countOnly,
      integrationPartner,
      accountsOnly
    })
    if (countOnly) {
      const [count] = transfers
      return count
    }
    if (accountsOnly) {
      const accounts = transfers.map((item: any) => {
        item.volumeUsdDisplay = formatCurrency(item.volumeUsd || 0, 'USD')
        return item
      })
      return accounts
    }

    let data = (transfers as any[])
    const transferIdNotFound = transferId && data?.length === 0

    data = data.map(populateData)
    console.timeEnd(_key)

    if (bondedStatus === 'pending') {
      data = data.filter((x: any) => {
        return !x.bonded
      })
    }
    if (bondedStatus === 'bonded') {
      data = data.filter((x: any) => {
        return x.bonded
      })
    }

    if ((accountAddress || transferId) && data?.length > 0 && (!isGoerli || (isGoerli && refreshFlag))) {
      // refetch recent transfers by account or single transferId
      const checkItems = data.slice(0, 5)
      for (const item of checkItems) {
        const { transferId } = item
        const cacheKey = `__worker__checking__${transferId}`
        const cacheDurationMs = 60 * 1000
        const alreadyChecking = cache.get(cacheKey)
        if (!alreadyChecking) {
          cache.put(cacheKey, true, cacheDurationMs)
          const { timestamp, bonded, bondTransactionHash } = item
          const shouldCheck = refreshFlag || (timestamp && !bonded) || (bonded && !bondTransactionHash)
          if (shouldCheck) {
            this.worker?.transferStats?.updateTransferDataForTransferId(transferId)
          }
        }
      }
    }

    if (transferIdNotFound && (!isGoerli || (isGoerli && refreshFlag))) {
      // fetch transfer that may not be indexed
      this.worker?.transferStats?.updateTransferDataForTransferId(transferId)

      try {
        // attempt to get on-chain data for transferId
        if (transferId?.length === 66) {
          const _data = await TransferStats.getTransferStatusForTxHash(transferId)
          if (_data) {
            data = [_data].map(populateData)
          }
        }
      } catch (err) { }
    }

    return data
  }

  async getTransferTimes (params: any): Promise<TimeToBridgeStats> {
    const { sourceChainSlug, destinationChainSlug } = params

    if (!sourceChainSlug) {
      throw new Error('sourceChainSlug is required')
    }

    if (!destinationChainSlug) {
      throw new Error('destinationChainSlug is required')
    }

    let days = 2
    let txTimes = await this.db.getTransferTimes(sourceChainSlug, destinationChainSlug, days)

    if (txTimes.length < 1) {
      days = 4
      txTimes = await this.db.getTransferTimes(sourceChainSlug, destinationChainSlug, days)

      if (txTimes.length < 1) {
        throw new Error('No transfer data available for set periods and chains')
      }
    }

    // array of transfer times as numbers
    const timesArray = txTimes.map(record => Number(record.bondWithinTimestamp))

    const cacheKey = `${sourceChainSlug}-${destinationChainSlug}`
    const cacheDurationMs = 5 * 60 * 1000 // 5 minutes
    const cachedStats = cache.get(cacheKey)

    if (cachedStats && typeof cachedStats === 'object' && 'avg' in cachedStats && 'median' in cachedStats && 'percentile90' in cachedStats) {
      return cachedStats as TimeToBridgeStats
    }

    const stats = timeToBridgeStats(timesArray)

    if (stats) {
      cache.put(cacheKey, stats, cacheDurationMs)
      return stats
    }

    throw new Error('Unexpected error while getting transfer times')
  }
}
