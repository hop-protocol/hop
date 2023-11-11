import AbstractChainBridge from '../AbstractChainBridge'
import AlchemyInclusionService from './inclusion/AlchemyInclusionService'
import Derive from './Derive'
import { CanonicalMessengerRootConfirmationGasLimit } from 'src/constants'
import {
  CrossChainMessage,
  CrossChainMessenger,
  MessageStatus
} from '@eth-optimism/sdk'
import { IChainBridge, MessageDirection } from '../IChainBridge'
import { IInclusionService, InclusionServiceConfig } from './inclusion/IInclusionService'
import { config as globalConfig } from 'src/config'
import { providers } from 'ethers'

type CachedCustomSafeBlockNumber = {
  lastCacheTimestampMs: number
  l2BlockNumberCustomSafe: number
}

type RelayOpts = {
  messageDirection: MessageDirection
}

class OptimismBridge extends AbstractChainBridge<CrossChainMessage, MessageStatus, RelayOpts> implements IChainBridge {
  csm: CrossChainMessenger
  derive: Derive = new Derive()
  inclusionService: IInclusionService | undefined
  private customSafeBlockNumberCache: CachedCustomSafeBlockNumber

  constructor (chainSlug: string) {
    super(chainSlug)

    this.csm = new CrossChainMessenger({
      bedrock: true,
      l1ChainId: globalConfig.isMainnet ? 1 : 5,
      l2ChainId: this.chainId,
      l1SignerOrProvider: this.l1Wallet,
      l2SignerOrProvider: this.l2Wallet
    })

    this.customSafeBlockNumberCache = {
      lastCacheTimestampMs: 0,
      l2BlockNumberCustomSafe: 0
    }

    const inclusionServiceConfig: InclusionServiceConfig = {
      chainSlug: this.chainSlug,
      l1Wallet: this.l1Wallet,
      l2Wallet: this.l2Wallet,
      logger: this.logger
    }

    this.inclusionService = new AlchemyInclusionService(inclusionServiceConfig)
  }

  async relayL1ToL2Message (l1TxHash: string): Promise<providers.TransactionResponse> {
    const relayOpts: RelayOpts = {
      messageDirection: MessageDirection.L1_TO_L2
    }
    return this.validateMessageAndSendTransaction(l1TxHash, relayOpts)
  }

  async relayL2ToL1Message (l2TxHash: string): Promise<providers.TransactionResponse> {
    const relayOpts: RelayOpts = {
      messageDirection: MessageDirection.L2_TO_L1
    }
    return this.validateMessageAndSendTransaction(l2TxHash, relayOpts)
  }

  async getL1InclusionTx (l2TxHash: string): Promise<providers.TransactionReceipt | undefined> {
    if (!this.inclusionService) return
    return this.inclusionService.getL1InclusionTx(l2TxHash)
  }

  async getL2InclusionTx (l1TxHash: string): Promise<providers.TransactionReceipt | undefined> {
    if (!this.inclusionService) return
    return this.inclusionService.getL2InclusionTx(l1TxHash)
  }

  async getCustomSafeBlockNumber (): Promise<number | undefined> {
    if (
      !this.inclusionService?.getLatestL1InclusionTxBeforeBlockNumber ||
      !this.inclusionService?.getLatestL2TxFromL1ChannelTx
    ) {
      this.logger.error('getCustomSafeBlockNumber: includeService not available')
      return
    }

    // Use a cache since the granularity of finality updates on l1 is on the order of minutes
    if (
      this._hasCacheBeenSet() &&
      !this._isCacheExpired()
    ) {
      const cacheValue = this.customSafeBlockNumberCache.l2BlockNumberCustomSafe
      this.logger.info(`getCustomSafeBlockNumber: using cached value ${cacheValue}`)
      return cacheValue
    }

    // Always update the cache with the latest block number. If the following calls fail, the cache
    // will never be updated and we will get into a loop.
    const now = Date.now()
    this._updateCache(now)

    // Get the latest checkpoint on L1
    const l1SafeBlock: providers.Block = await this.l1Wallet.provider!.getBlock('safe')
    const l1InclusionTx = await this.inclusionService.getLatestL1InclusionTxBeforeBlockNumber(l1SafeBlock.number)
    if (!l1InclusionTx) {
      this.logger.error(`getCustomSafeBlockNumber: no L1 inclusion tx found before block ${l1SafeBlock.number}`)
      return
    }

    // Derive the L2 block number from the L1 inclusion tx
    const latestSafeL2Tx = await this.inclusionService.getLatestL2TxFromL1ChannelTx(l1InclusionTx.transactionHash)
    const customSafeBlockNumber = latestSafeL2Tx?.blockNumber
    if (!customSafeBlockNumber) {
      this.logger.error(`getCustomSafeBlockNumber: no L2 tx found for L1 inclusion tx ${l1InclusionTx.transactionHash}`)
      return
    }

    this._updateCache(now, customSafeBlockNumber)
    return customSafeBlockNumber
  }

  private _hasCacheBeenSet (): boolean {
    return this.customSafeBlockNumberCache.l2BlockNumberCustomSafe !== 0
  }

  private _isCacheExpired (): boolean {
    const now = Date.now()
    const cacheExpirationTimeMs = 60 * 1000
    const lastCacheTimestampMs = this.customSafeBlockNumberCache.lastCacheTimestampMs
    return now - lastCacheTimestampMs > cacheExpirationTimeMs
  }

  private _updateCache (lastCacheTimestampMs: number, l2BlockNumber?: number): void {
    const l2BlockNumberCustomSafe: number = l2BlockNumber ?? this.customSafeBlockNumberCache.l2BlockNumberCustomSafe
    this.customSafeBlockNumberCache = {
      lastCacheTimestampMs,
      l2BlockNumberCustomSafe
    }
  }

  protected async sendRelayTransaction (message: CrossChainMessage, relayOpts: RelayOpts): Promise<providers.TransactionResponse> {
    const { messageDirection } = relayOpts
    if (messageDirection === MessageDirection.L1_TO_L2) {
      return this.csm.proveMessage(message)
    } else {
      // Need an arbitrary value that will always succeed
      // Signer is needed to execute tx with SDK
      const gasLimit = 1000000
      const txOpts: any = {
        signer: this.l2Wallet,
        overrides: {
          gasLimit
        }
      }
      return this.csm.resendMessage(message, txOpts)
    }
  }

  protected async getMessage (txHash: string): Promise<CrossChainMessage> {
    const messages: CrossChainMessage[] = await this.csm.getMessagesByTransaction(txHash)
    if (!messages) {
      throw new Error('could not find messages for tx hash')
    }
    return messages[0]
  }

  protected async getMessageStatus (message: CrossChainMessage): Promise<MessageStatus> {
    return this.csm.getMessageStatus(message.transactionHash)
  }

  protected isMessageInFlight(messageStatus: MessageStatus): boolean {
    return (
      messageStatus === MessageStatus.UNCONFIRMED_L1_TO_L2_MESSAGE,
      messageStatus === MessageStatus.STATE_ROOT_NOT_PUBLISHED
    )
  }

  protected isMessageCheckpointed(messageStatus: MessageStatus): boolean {
    return messageStatus === MessageStatus.READY_FOR_RELAY
  }

  protected isMessageRelayed(messageStatus: MessageStatus): boolean {
    return messageStatus === MessageStatus.RELAYED
  }
}



export default OptimismBridge
