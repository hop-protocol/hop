import mcache from 'memory-cache'
import Db, { getInstance } from './Db'
import { DateTime } from 'luxon'
import Worker from './worker'
import { isGoerli } from './config'
import TransferStats from './TransferStats'

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

const transferTimes = {
  ethereum: {
    optimism: 10,
    arbitrum: 16,
    polygon: 25,
    gnosis: 5
  },
  optimism: {
    ethereum: 1,
    arbitrum: 1,
    polygon: 1,
    gnosis: 1
  },
  arbitrum: {
    ethereum: 1,
    optimism: 1,
    polygon: 1,
    gnosis: 1
  },
  polygon: {
    ethereum: 5,
    optimism: 5,
    arbitrum: 5,
    gnosis: 5
  },
  gnosis: {
    ethereum: 1,
    optimism: 1,
    arbitrum: 1,
    polygon: 1
  }
}

function truncateAddress (address :string) {
  return truncateString(address, 4)
}

function truncateString (str: string, splitNum: number) {
  if (!str) return ''
  return str.substring(0, 2 + splitNum) + '…' + str.substring(str.length - splitNum, str.length)
}

function getSourceChainId (chain: string) {
  if (chain === 'ethereum') {
    if (isGoerli) {
      return 5
    }
    return 1
  }
  if (chain === 'gnosis') {
    return 100
  }
  if (chain === 'polygon') {
    if (isGoerli) {
      return 80001
    }
    return 137
  }
  if (chain === 'optimism') {
    if (isGoerli) {
      return 420
    }
    return 10
  }
  if (chain === 'arbitrum') {
    if (isGoerli) {
      return 421613
    }
    return 42161
  }
  throw new Error(`unsupported chain "${chain}"`)
}

function explorerLink (chain: string) {
  let base = ''
  if (chain === 'gnosis') {
    base = 'https://blockscout.com/xdai/mainnet'
  } else if (chain === 'polygon') {
    base = 'https://polygonscan.com'
    if (isGoerli) {
      base = 'https://mumbai.polygonscan.com'
    }
  } else if (chain === 'optimism') {
    base = 'https://optimistic.etherscan.io'
    if (isGoerli) {
      base = 'https://goerli-optimism.etherscan.io'
    }
  } else if (chain === 'arbitrum') {
    base = 'https://arbiscan.io'
  } else {
    base = 'https://etherscan.io'
    if (isGoerli) {
      base = 'https://goerli.etherscan.io'
    }
  }

  return base
}

function explorerLinkAddress (chain: string, address: string) {
  const base = explorerLink(chain)
  return `${base}/address/${address}`
}

type Transfer = {
  accountAddress: string
  amount: string
  amountDisplay: string
  amountFormatted: string
  amountOutMin: string
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
  unbondabe: boolean
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
      const accounts = transfers
      return accounts
    }

    let data = (transfers as any[])
    const transferIdNotFound = transferId && data?.length === 0

    data = data.map(this.populatedData)
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
          const shouldCheck = refreshFlag || (timestamp && !bonded) || (bonded && !bondTransactionHash)
          if (shouldCheck) {
            this.worker?.transferStats?.updateTransferDataForTransferId(transferId)
          }
        }
      }
    }

    if (transferIdNotFound) {
      // fetch transfer that may not be indexed
      this.worker?.transferStats?.updateTransferDataForTransferId(transferId)

      try {
        // attempt to get on-chain data for transferId
        if (transferId?.length === 66) {
          const _data = await TransferStats.getTransferStatusForTxHash(transferId)
          if (_data) {
            data = [_data].map(this.populatedData)
          }
        }
      } catch (err) { }
    }

    return data
  }

  populatedData = (x: any, i: number) => {
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
    if (x.amountReceivedFormatted) {
      x.amountReceivedFormatted = Number(x.amountReceivedFormatted)
    }

    x.i = i
    x.bonded = !!x.bonded
    if (x.timestamp) {
      x.timestampRelative = DateTime.fromSeconds(x.timestamp).toRelative()
      const transferTime = DateTime.fromSeconds(x.timestamp)
      x.receiveStatusUnknown = x.sourceChainId === getSourceChainId('ethereum') && !x.bondTxExplorerUrl && DateTime.now().toUTC().toSeconds() > transferTime.toSeconds() + (60 * 60 * 2)
    }
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
      x.convertHTokenUrl = `https://${isGoerli ? 'goerli.hop.exchange' : 'app.hop.exchange'}/#/convert/amm?token=${x.token}&sourceNetwork=${x.destinationChainSlug}&fromHToken=true`
    }

    x.hopExplorerUrl = `https://${isGoerli ? 'goerli.explorer.hop.exchange' : 'explorer.hop.exchange'}/?transferId=${x.transferId}`

    if (x.integrationPartner) {
      const names = {
        socket: 'Socket',
        lifi: 'LI.FI',
        metamask: 'MetaMask',
        chainhop: 'ChainHop'
      }
      const imageUrls = {
        socket: 'https://assets.hop.exchange/logos/socket.jpg',
        lifi: 'https://assets.hop.exchange/logos/lifi.webp',
        metamask: 'https://assets.hop.exchange/logos/metamask.svg',
        chainhop: 'https://assets.hop.exchange/logos/chainhop.png'
      }
      x.integrationPartnerName = names[x.integrationPartner]
      x.integrationPartnerImageUrl = imageUrls[x.integrationPartner]
    }

    x.estimatedUnixTimeUntilBond = 0
    x.estimatedSecondsUntilBond = 0
    x.estimatedRelativeTimeUntilBond = 0

    if (!x.bonded && x.sourceChainSlug && x.destinationChainSlug) {
      const minutes = transferTimes?.[x.sourceChainSlug]?.[x.destinationChainSlug]
      if (minutes) {
        const bufferMinutes = 5 // to allow for enough time for indexer
        const transferTime = DateTime.fromSeconds(x.timestamp)
        const now = DateTime.now().toUTC()
        const estimatedDate = transferTime.plus({ minutes: minutes + bufferMinutes })
        const unixTimestamp = Math.floor(estimatedDate.toSeconds())
        const estimatedSeconds = Math.floor(estimatedDate.toSeconds() - now.toSeconds())
        const relativeTime = estimatedDate.toRelative()
        if (estimatedSeconds > 0) {
          x.estimatedUnixTimeUntilBond = unixTimestamp
          x.estimatedSecondsUntilBond = estimatedSeconds
          x.estimatedRelativeTimeUntilBond = relativeTime
        }
      }
    }

    return x
  }
}
