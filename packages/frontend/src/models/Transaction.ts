import { ethers, providers } from 'ethers'
import { EventEmitter } from 'events'
import { Hop, Token } from '@hop-protocol/sdk'
import { L1_NETWORK } from 'src/constants'
import {
  getRpcUrl,
  getProvider,
  getBaseExplorerUrl,
  findTransferFromL1CompletedLog,
  getTransferSentDetailsFromLogs,
  fetchTransferFromL1Completeds,
  fetchWithdrawalBondedsByTransferId,
  L1Transfer,
} from 'src/utils'
import { network as defaultNetwork } from 'src/config'
import logger from 'src/logger'
import { formatError } from 'src/utils/format'
import { getNetworkWaitConfirmations } from 'src/utils/networks'

interface Config {
  hash: string
  networkName: string
  destNetworkName?: string | null
  isCanonicalTransfer?: boolean
  pending?: boolean
  token?: Token
  timestamp?: number
  transferId?: string | null
  pendingDestinationConfirmation?: boolean
  destTxHash?: string
  replaced?: boolean | string
}

class Transaction extends EventEmitter {
  readonly hash: string
  readonly networkName: string
  readonly destNetworkName: string | null = null
  readonly isCanonicalTransfer: boolean = false
  readonly provider: ethers.providers.Provider
  readonly destProvider: ethers.providers.Provider | null = null
  pending: boolean = true
  token: Token | null = null
  timestamp: number
  status: null | boolean = null
  transferId: string | null = null
  pendingDestinationConfirmation: boolean = true
  destTxHash?: string
  replaced: boolean | string = false

  constructor({
    hash,
    networkName,
    destNetworkName,
    isCanonicalTransfer,
    pending = true,
    token,
    timestamp,
    transferId,
    pendingDestinationConfirmation = true,
    destTxHash,
    replaced = false,
  }: Config) {
    super()
    this.hash = (hash || '').trim().toLowerCase()
    this.networkName = (networkName || defaultNetwork).trim().toLowerCase()
    let rpcUrl = ''
    if (networkName.startsWith('arbitrum')) {
      rpcUrl = getRpcUrl('arbitrum')
    } else if (networkName.startsWith('optimism')) {
      rpcUrl = getRpcUrl('optimism')
    } else if (networkName.startsWith('xdai')) {
      rpcUrl = getRpcUrl('xdai')
    } else if (networkName.startsWith('matic') || networkName.startsWith('polygon')) {
      rpcUrl = getRpcUrl('polygon')
    } else {
      rpcUrl = getRpcUrl(L1_NETWORK)
    }

    if (destNetworkName) {
      this.destNetworkName = destNetworkName
      this.pendingDestinationConfirmation = pendingDestinationConfirmation

      let destRpcUrl = ''
      if (destNetworkName.startsWith('arbitrum')) {
        destRpcUrl = getRpcUrl('arbitrum')
      } else if (destNetworkName.startsWith('optimism')) {
        destRpcUrl = getRpcUrl('optimism')
      } else if (destNetworkName.startsWith('xdai')) {
        destRpcUrl = getRpcUrl('xdai')
      } else if (destNetworkName.startsWith('matic') || destNetworkName.startsWith('polygon')) {
        destRpcUrl = getRpcUrl('polygon')
      } else {
        destRpcUrl = getRpcUrl(L1_NETWORK)
      }

      this.destProvider = getProvider(destRpcUrl)
    }

    // TODO: cleanup
    this.provider = getProvider(rpcUrl)
    this.timestamp = timestamp || Date.now()
    this.pending = pending
    if (destTxHash) {
      this.destTxHash = destTxHash
    }
    if (token) {
      this.token = token
    }
    if (transferId) {
      this.transferId = transferId
    }
    if (replaced) {
      this.replaced = replaced
    }

    this.receipt().then((receipt: providers.TransactionReceipt) => {
      const tsDetails = getTransferSentDetailsFromLogs(receipt.logs)

      // Source: L2
      if (tsDetails?.transferId) {
        this.transferId = tsDetails.transferId
      }

      this.status = !!receipt.status
      const waitConfirmations = getNetworkWaitConfirmations(this.networkName)
      if (waitConfirmations && receipt.status === 1 && receipt.confirmations > waitConfirmations) {
        this.pending = false
      }
      this.emit('pending', false, this)
    })
    if (typeof isCanonicalTransfer === 'boolean') {
      this.isCanonicalTransfer = isCanonicalTransfer
    }
  }

  get explorerLink(): string {
    if (this.networkName.startsWith('ethereum')) {
      return this._etherscanLink()
    } else if (this.networkName.startsWith('arbitrum')) {
      return this._arbitrumLink()
    } else if (this.networkName.startsWith('optimism')) {
      return this._optimismLink()
    } else if (this.networkName.startsWith('xdai')) {
      return this._xdaiLink()
    } else if (this.networkName.startsWith('polygon')) {
      return this._polygonLink()
    } else {
      return ''
    }
  }

  get destExplorerLink(): string {
    if (!this.destTxHash) return ''

    if (this.destNetworkName?.startsWith('ethereum')) {
      return this._etherscanLink('ethereum', this.destTxHash)
    } else if (this.destNetworkName?.startsWith('arbitrum')) {
      return this._arbitrumLink(this.destTxHash)
    } else if (this.destNetworkName?.startsWith('optimism')) {
      return this._optimismLink(this.destTxHash)
    } else if (this.destNetworkName?.startsWith('xdai')) {
      return this._xdaiLink(this.destTxHash)
    } else if (this.destNetworkName?.startsWith('polygon')) {
      return this._polygonLink(this.destTxHash)
    } else {
      return ''
    }
  }

  get truncatedHash(): string {
    return `${this.hash.substring(0, 6)}…${this.hash.substring(62, 66)}`
  }

  async receipt() {
    return this.provider.waitForTransaction(this.hash)
  }

  async getTransaction() {
    return this.provider.getTransaction(this.hash)
  }

  async getDestTransaction() {
    if (this.destTxHash && this.destProvider) {
      return this.destProvider.getTransaction(this.destTxHash)
    }
  }

  async checkIsTransferIdSpent(sdk: Hop) {
    if (
      !(
        this.provider &&
        this.token &&
        this.destNetworkName &&
        this.networkName !== this.destNetworkName
      )
    ) {
      return
    }

    try {
      const receipt = await this.receipt()
      // Get the event data (topics)
      const tsDetails = getTransferSentDetailsFromLogs(receipt.logs)
      const bridge = sdk.bridge(this.token.symbol)

      // No transferId because L1 -> L2
      if (tsDetails && !tsDetails.transferId) {
        const l1Bridge = await bridge.getL1Bridge(this.provider)
        // Get the rest of the event data
        const decodedData = l1Bridge.interface.decodeEventLog(
          tsDetails?.eventName!,
          tsDetails?.log.data
        )

        if ('amount' in decodedData) {
          const { amount, deadline } = decodedData
          // Query Graph Protocol for TransferFromL1Completed events
          const transferFromL1Completeds = await fetchTransferFromL1Completeds(
            this.destNetworkName,
            tsDetails.recipient,
            amount,
            deadline
          )

          if (transferFromL1Completeds?.length) {
            const lastTransfer: L1Transfer =
              transferFromL1Completeds[transferFromL1Completeds.length - 1]

            this.destTxHash = lastTransfer.transactionHash
            this.pendingDestinationConfirmation = false
            return true
          }

          // If TheGraph is not working...
          const destL2Bridge = await bridge.getL2Bridge(this.destNetworkName)
          const bln = await destL2Bridge.provider.getBlockNumber()
          const evs = await destL2Bridge.queryFilter(
            destL2Bridge.filters.TransferFromL1Completed(),
            bln - 9999,
            bln
          )

          if (evs?.length) {
            // Find the matching amount
            const tfl1Completed = findTransferFromL1CompletedLog(
              evs,
              tsDetails.recipient,
              amount,
              deadline
            )
            if (tfl1Completed) {
              this.destTxHash = tfl1Completed.transactionHash
              this.pendingDestinationConfirmation = false
              return true
            }
          }

          logger.debug(`tx ${tsDetails.txHash.slice(0, 10)} isSpent:`, false)
        }
      }

      // transferId found in event: TransferSent
      if (tsDetails?.transferId) {
        this.transferId = tsDetails.transferId
      }

      // Transfer from L2
      // transferId found in event: TransferSent
      if (this.transferId && this.destNetworkName) {
        // Query Graph Protocol for WithdrawalBonded events
        const withdrawalBondeds = await fetchWithdrawalBondedsByTransferId(
          this.destNetworkName,
          this.transferId
        )
        if (withdrawalBondeds?.length) {
          const lastEvent = withdrawalBondeds[withdrawalBondeds.length - 1]
          this.destTxHash = lastEvent.transactionHash
        }

        // L2 -> L1
        if (this.destNetworkName === 'ethereum') {
          const destL1Bridge = await bridge.getL1Bridge(this.provider)
          const isSpent = await destL1Bridge.isTransferIdSpent(this.transferId)
          if (isSpent) {
            this.pendingDestinationConfirmation = false
          }
          logger.debug(`isSpent(${this.transferId.slice(0, 10)}: transferId):`, isSpent)
          return isSpent
        }

        // L2 -> L2
        const destL2Bridge = await bridge.getL2Bridge(this.destNetworkName)
        const isSpent = await destL2Bridge.isTransferIdSpent(this.transferId)
        if (isSpent) {
          this.pendingDestinationConfirmation = false
        }
        logger.debug(`isSpent(${this.transferId.slice(0, 10)}: transferId):`, isSpent)
        return isSpent
      }
    } catch (error) {
      logger.error(formatError(error))
    }

    return false
  }

  private _etherscanLink(networkName: string = this.networkName, txHash: string = this.hash) {
    return `${getBaseExplorerUrl(networkName)}/tx/${txHash}`
  }

  private _arbitrumLink(txHash: string = this.hash) {
    return `${getBaseExplorerUrl('arbitrum')}/tx/${txHash}`
  }

  private _optimismLink(txHash: string = this.hash) {
    try {
      const url = new URL(getBaseExplorerUrl('optimism'))
      return `${url.origin}${url.pathname}/tx/${txHash}${url.search}`
    } catch (err) {
      return ''
    }
  }

  private _xdaiLink(txHash: string = this.hash) {
    return `${getBaseExplorerUrl('xdai')}/tx/${txHash}`
  }

  private _polygonLink(txHash: string = this.hash) {
    return `${getBaseExplorerUrl('polygon')}/tx/${txHash}`
  }

  toObject() {
    const {
      hash,
      networkName,
      pending,
      timestamp,
      token,
      destNetworkName,
      destTxHash,
      isCanonicalTransfer,
      pendingDestinationConfirmation,
      transferId,
      replaced,
    } = this
    return {
      hash,
      networkName,
      pending,
      timestamp,
      token,
      destNetworkName,
      destTxHash,
      isCanonicalTransfer,
      pendingDestinationConfirmation,
      transferId,
      replaced,
    }
  }

  static fromObject(obj: any) {
    const {
      hash,
      networkName,
      pending,
      timestamp,
      token,
      destNetworkName,
      destTxHash,
      isCanonicalTransfer,
      pendingDestinationConfirmation,
      transferId,
      replaced,
    } = obj
    return new Transaction({
      hash,
      networkName,
      pending,
      timestamp,
      token,
      destNetworkName,
      destTxHash,
      isCanonicalTransfer,
      pendingDestinationConfirmation,
      transferId,
      replaced,
    })
  }
}

export default Transaction
