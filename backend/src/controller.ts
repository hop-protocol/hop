import mcache from 'memory-cache'
import Db, { getInstance } from './Db'
import { DateTime } from 'luxon'
import Worker from './worker'

const colorsMap: any = {
  ethereum: '#868dac',
  gnosis: '#46a4a1',
  polygon: '#8b57e1',
  optimism: '#e64b5d',
  arbitrum: '#289fef',
  bonded: '#81ff81',
  pending: '#ffc55a',
  fallback: '#9f9fa3'
}

function truncateAddress (address :string) {
  return truncateString(address, 4)
}

function truncateString (str: string, splitNum: number) {
  if (!str) return ''
  return str.substring(0, 2 + splitNum) + '…' + str.substring(str.length - splitNum, str.length)
}

function explorerLink (chain: string) {
  let base = ''
  if (chain === 'gnosis') {
    base = 'https://blockscout.com/xdai/mainnet'
  } else if (chain === 'polygon') {
    base = 'https://polygonscan.com'
  } else if (chain === 'optimism') {
    base = 'https://optimistic.etherscan.io'
  } else if (chain === 'arbitrum') {
    base = 'https://arbiscan.io'
  } else {
    base = 'https://etherscan.io'
  }

  return base
}

function explorerLinkAddress (chain: string, address: string) {
  const base = explorerLink(chain)
  return `${base}/address/${address}`
}

type Transfer = {
  id: string
  transferId: string
  transferIdTruncated: string
  transactionHash: string
  transactionHashTruncated: string
  transactionHashExplorerUrl: string
  sourceChainId: string
  sourceChainSlug: string
  sourceChainName: string
  sourceChainImageUrl: string
  destinationChainId: string
  destinationChainSlug: string
  destinationChainName: string
  destinationChainImageUrl: string
  accountAddress: string
  amount: string
  amountFormatted: string
  amountDisplay: string
  amountUsd: string
  amountUsdDisplay: string
  amountOutMin: string
  deadline: string
  recipientAddress: string
  recipientAddressTruncated: string
  recipientAddressExplorerUrl: string
  bonderFee: string
  bonderFeeFormatted: string
  bonderFeeDisplay: string
  bonderFeeUsd: string
  bonderFeeUsdDisplay: string
  bonded: boolean
  bondTimestamp: string
  bondTimestampIso: string
  bondWithinTimestamp: string
  bondWithinTimestampRelative: string
  bondTransactionHash: string
  bondTransactionHashTruncated: string
  bondTransactionHashExplorerUrl: string
  bonderAddress: string
  bonderAddressTruncated: string
  bonderAddressExplorerUrl: string
  token: string
  tokenImageUrl: string
  tokenPriceUsd: string
  tokenPriceUsdDisplay: string
  timestamp: string
  timestampIso: string
  preregenesis: boolean

  sourceChainColor: string
  destinationChainColor: string
  bondStatusColor: string
  receivedHTokens: boolean
  convertHTokenUrl: string
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
    const accountAddress = params.accountAddress
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
    let sortBy = params.sortBy
    const sortDirection = params.sortDirection
    const countOnly = params.countOnly
    const receivedHTokens = params.receivedHTokens
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
      page = 0
    }

    if (perPage <= 0) {
      perPage = 0
    }

    if (perPage > 100) {
      perPage = 100
    }

    page = page - 1 // db page

    let startTimestamp :any
    if (startDate) {
      startTimestamp = Math.floor(DateTime.fromFormat(startDate, 'yyyy-MM-dd').startOf('day').toUTC().toSeconds())
    }

    let endTimestamp :any
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
        token: 'token'
      }
      sortBy = sortBys[sortBy]
    }

    if (sortDirection) {
      if (!['desc', 'asc'].includes(sortDirection)) {
        throw new Error('invalid sort direction')
      }
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
      endTimestamp,
      startTimestamp,
      sortBy,
      sortDirection,
      receivedHTokens,
      countOnly
    })
    if (countOnly) {
      const [count] = transfers
      return count
    }
    let data = (transfers as any[]).map((x: any, i: number) => {
      x.sourceChainId = Number(x.sourceChainId)
      x.destinationChainId = Number(x.destinationChainId)
      x.amountFormatted = Number(x.amountFormatted)
      x.amountUsd = Number(x.amountUsd)
      x.deadline = x.deadline ? Number(x.deadline) : null
      x.bonderFeeFormatted = x.bonderFeeFormatted ? Number(x.bonderFeeFormatted) : null
      x.bonderFeeUsd = x.bonderFeeUsd ? Number(x.bonderFeeUsd) : null
      x.bondTimestamp = x.bondTimestamp ? Number(x.bondTimestamp) : null
      x.bondWithinTimestamp = x.bondWithinTimestamp ? Number(x.bondWithinTimestamp) : null
      x.tokenPriceUsd = x.tokenPriceUsd ? Number(x.tokenPriceUsd) : null
      x.timestamp = x.timestamp ? Number(x.timestamp) : null

      x.i = i
      x.bonded = !!x.bonded
      x.timestampRelative = DateTime.fromSeconds(x.timestamp).toRelative()

      const transferTime = DateTime.fromSeconds(x.timestamp)

      x.receiveStatusUnknown = x.sourceChainId === 1 && !x.bondTxExplorerUrl && DateTime.now().toUTC().toSeconds() > transferTime.toSeconds() + (60 * 60 * 2)
      if (x.receiveStatusUnknown) {
        // x.bonded = true
      }
      x.preregenesis = !!x.preregenesis
      x.bondTimestampRelative = x.bondTimestamp ? DateTime.fromSeconds(x.bondTimestamp).toRelative() : ''

      if (!x.accountAddressTruncated) {
        x.accountAddressTruncated = truncateAddress(x.accountAddress)
      }

      if (!x.accountAddressExplorerUrl) {
        x.accountAddressExplorerUrl = explorerLinkAddress(x.sourceChainSlug, x.accountAddress)
      }

      if (!x.recipientAddressTruncated) {
        x.recipientAddressTruncated = truncateAddress(x.recipientAddress)
      }

      // TODO: rerun worker
      if (!x.recipientAddressExplorerUrl || x.recipientAddressExplorerUrl?.includes('undefined')) {
        x.recipientAddressExplorerUrl = explorerLinkAddress(x.destinationChainSlug, x.recipientAddress)
      }

      if (!x.sourceChainColor) {
        x.sourceChainColor = colorsMap[x.sourceChainSlug] ?? colorsMap.fallback
      }

      if (!x.destinationChainColor) {
        x.destinationChainColor = colorsMap[x.destinationChainSlug] ?? colorsMap.fallback
      }

      if (!x.bondStatusColor) {
        x.bondStatusColor = x.bonded ? colorsMap.bonded : colorsMap.pending
      }

      if (typeof x.receivedHTokens !== 'boolean') {
        x.receivedHTokens = false
      }
      if (!x.convertHTokenUrl) {
        x.convertHTokenUrl = `https://app.hop.exchange/#/convert/amm?token=${x.token}&sourceNetwork=${x.sourceChainSlug}&destNetwork=${x.destinationChainSlug}&fromHToken=true`
      }

      return x
    })
    console.timeEnd(_key)

    if (bondedStatus === 'pending') {
      data = data.filter((x: any) => {
        return !x.bonded && x.sourceChainSlug !== 'ethereum'
      })
    }
    if (bondedStatus === 'bonded') {
      data = data.filter((x: any) => {
        return x.sourceChainSlug !== 'ethereum'
      })
    }

    if ((accountAddress || transferId) && data?.length > 0) {
      // refetch recent transfers by account or single transferId
      const checkItems = data.slice(0, 5)
      for (const item of checkItems) {
        const { transferId } = item
        const key = `__worker__checking__${transferId}`
        const alreadyChecking = mcache.get(key)
        if (!alreadyChecking) {
          mcache.put(key, true, 60 * 1000)
          const { timestamp, bonded, bondTransactionHash } = item
          const shouldCheck = (timestamp && !bonded) || (bonded && !bondTransactionHash)
          if (shouldCheck) {
            this.worker?.transferStats?.updateTransferDataForTransferId(transferId)
          }
        }
      }
    }

    // fetch transfer that may not be indexed
    if (transferId && data?.length === 0) {
      this.worker?.transferStats?.updateTransferDataForTransferId(transferId)
    }

    return data
  }
}
