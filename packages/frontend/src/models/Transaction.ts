import { ethers, providers } from 'ethers'
import { EventEmitter } from 'events'
import { Hop, Token, ChainSlug } from '@hop-protocol/sdk'
import {
  getBaseExplorerUrl,
  findTransferFromL1CompletedLog,
  getTransferSentDetailsFromLogs,
  fetchTransferFromL1Completeds,
  fetchWithdrawalBondedsByTransferId,
  L1Transfer,
  networkIdToSlug,
  queryFilterTransferFromL1CompletedEvents,
} from 'src/utils'
import { network as defaultNetwork, reactAppNetwork } from 'src/config'
import logger from 'src/logger'
import { formatError } from 'src/utils/format'
import { getNetworkWaitConfirmations } from 'src/utils/networks'
import { sigHashes } from 'src/hooks/useTransaction'
import { getProviderByNetworkName } from 'src/utils/getProvider'

interface ContructorArgs {
  hash: string
  networkName: string
  destNetworkName?: string | null
  isCanonicalTransfer?: boolean
  pending?: boolean
  token?: Token
  timestampMs?: number
  blockNumber?: number
  transferId?: string | null
  pendingDestinationConfirmation?: boolean
  destTxHash?: string
  replaced?: boolean | string
  nonce?: number | undefined
  from?: string | undefined
  to?: string | undefined
}

class Transaction extends EventEmitter {
  readonly hash: string
  readonly networkName: string
  destNetworkName: string | null = null
  readonly isCanonicalTransfer: boolean = false
  readonly provider: ethers.providers.Provider
  destProvider: ethers.providers.Provider | null = null
  pending: boolean = true
  token: Token | null = null
  timestampMs: number
  blockNumber?: number
  status: null | boolean = null
  transferId: string | null = null
  pendingDestinationConfirmation: boolean = true
  destTxHash: string = ''
  replaced: boolean | string = false
  methodName: string = ''
  nonce?: number | undefined = undefined
  from?: string | undefined = undefined
  to?: string | undefined = undefined

  constructor({
    hash,
    networkName,
    destNetworkName = null,
    isCanonicalTransfer,
    pending = true,
    token,
    timestampMs,
    transferId = null,
    pendingDestinationConfirmation = true,
    destTxHash = '',
    replaced = false,
    nonce,
    from,
    to,
  }: ContructorArgs) {
    super()
    this.hash = (hash || '').trim().toLowerCase()
    this.networkName = (networkName || defaultNetwork).trim().toLowerCase()

    // TODO: not sure if changing pendingDestinationConfirmation will have big effects
    if (destNetworkName) {
      this.destNetworkName = destNetworkName
      this.pendingDestinationConfirmation = pendingDestinationConfirmation
      this.destProvider = getProviderByNetworkName(destNetworkName)
    }

    this.provider = getProviderByNetworkName(networkName)
    this.timestampMs = timestampMs || Date.now()
    this.pending = pending
    this.transferId = transferId
    this.replaced = replaced
    this.destTxHash = destTxHash
    this.nonce = nonce
    this.from = from
    this.to = to
    this.token = token || null

    this.getTransaction().then((txResponse: providers.TransactionResponse) => {
      const funcSig = txResponse?.data?.slice(0, 10)
      this.methodName = sigHashes[funcSig]
    })

    this.receipt().then(async (receipt: providers.TransactionReceipt) => {
      const tsDetails = getTransferSentDetailsFromLogs(receipt.logs)
      this.blockNumber = receipt.blockNumber
      const block = await this.provider.getBlock(receipt.blockNumber)
      this.timestampMs = block.timestamp * 1000

      if (tsDetails?.chainId) {
        this.destNetworkName = networkIdToSlug(tsDetails.chainId)
        this.destProvider = getProviderByNetworkName(this.destNetworkName)
      }

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

    if (this.pendingDestinationConfirmation && this.destNetworkName) {
      const sdk = new Hop(reactAppNetwork)
      this.checkIsTransferIdSpent(sdk)
    }
  }

  get explorerLink(): string {
    if (this.networkName.startsWith(ChainSlug.Ethereum)) {
      return this._etherscanLink()
    } else if (this.networkName.startsWith(ChainSlug.Arbitrum)) {
      return this._arbitrumLink()
    } else if (this.networkName.startsWith(ChainSlug.Optimism)) {
      return this._optimismLink()
    } else if (this.networkName.startsWith(ChainSlug.Gnosis)) {
      return this._gnosisLink()
    } else if (this.networkName.startsWith(ChainSlug.Polygon)) {
      return this._polygonLink()
    } else {
      return ''
    }
  }

  get destExplorerLink(): string {
    if (!this.destTxHash) return ''

    if (this.destNetworkName?.startsWith(ChainSlug.Ethereum)) {
      return this._etherscanLink(ChainSlug.Ethereum, this.destTxHash)
    } else if (this.destNetworkName?.startsWith(ChainSlug.Arbitrum)) {
      return this._arbitrumLink(this.destTxHash)
    } else if (this.destNetworkName?.startsWith(ChainSlug.Optimism)) {
      return this._optimismLink(this.destTxHash)
    } else if (this.destNetworkName?.startsWith(ChainSlug.Gnosis)) {
      return this._gnosisLink(this.destTxHash)
    } else if (this.destNetworkName?.startsWith(ChainSlug.Polygon)) {
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
      logger.warn(`missing provider, token, destNetworkName, or same network:`, this)
      return
    }

    try {
      if (!this.pendingDestinationConfirmation) {
        return true
      }
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
            this.setPendingDestinationConfirmed()
            return true
          }

          // If TheGraph is not working...
          const evs = await queryFilterTransferFromL1CompletedEvents(bridge, this.destNetworkName)

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
              this.setPendingDestinationConfirmed()
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
        if (this.destNetworkName === ChainSlug.Ethereum) {
          const destL1Bridge = await bridge.getL1Bridge(this.provider)
          const isSpent = await destL1Bridge.isTransferIdSpent(this.transferId)
          if (isSpent) {
            this.setPendingDestinationConfirmed()
          }
          logger.debug(`isSpent(${this.transferId.slice(0, 10)}: transferId):`, isSpent)
          return isSpent
        }

        // L2 -> L2
        const destL2Bridge = await bridge.getL2Bridge(this.destNetworkName)
        const isSpent = await destL2Bridge.isTransferIdSpent(this.transferId)
        if (isSpent) {
          this.setPendingDestinationConfirmed()
        }
        logger.debug(`isSpent(${this.transferId.slice(0, 10)}: transferId):`, isSpent)
        return isSpent
      }
    } catch (error) {
      logger.error(formatError(error))
    }

    return false
  }

  public get isBridgeTransfer() {
    return ['sendToL2', 'swapAndSend'].includes(this.methodName)
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

  private _gnosisLink(txHash: string = this.hash) {
    return `${getBaseExplorerUrl('gnosis')}/tx/${txHash}`
  }

  private _polygonLink(txHash: string = this.hash) {
    return `${getBaseExplorerUrl('polygon')}/tx/${txHash}`
  }

  private setPendingDestinationConfirmed() {
    this.pendingDestinationConfirmation = false
    this.emit('pendingDestinationConfirmation', false, this)
  }

  toObject() {
    const {
      hash,
      networkName,
      pending,
      timestampMs,
      token,
      destNetworkName,
      destTxHash,
      isCanonicalTransfer,
      pendingDestinationConfirmation,
      transferId,
      replaced,
      methodName,
      nonce,
      from,
      to,
    } = this
    return {
      hash,
      networkName,
      pending,
      timestampMs,
      token,
      destNetworkName,
      destTxHash,
      isCanonicalTransfer,
      pendingDestinationConfirmation,
      transferId,
      replaced,
      methodName,
      nonce,
      from,
      to,
    }
  }

  static fromObject(obj: any) {
    const {
      hash,
      networkName,
      pending,
      timestampMs,
      token,
      destNetworkName,
      destTxHash,
      isCanonicalTransfer,
      pendingDestinationConfirmation,
      transferId,
      replaced,
      nonce,
      from,
      to,
    } = obj
    return new Transaction({
      hash,
      networkName,
      pending,
      timestampMs,
      token,
      destNetworkName,
      destTxHash,
      isCanonicalTransfer,
      pendingDestinationConfirmation,
      transferId,
      replaced,
      nonce,
      from,
      to,
    })
  }
}

export default Transaction
