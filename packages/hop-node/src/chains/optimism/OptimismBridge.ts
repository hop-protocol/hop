import AbstractChainBridge from '../AbstractChainBridge'
import AlchemyInclusionService from './inclusion/AlchemyInclusionService'
import Derive from './Derive'
import { CanonicalMessengerRootConfirmationGasLimit } from 'src/constants'
import { CrossChainMessenger, MessageStatus } from '@eth-optimism/sdk'
import { FinalityBlockTag, IChainBridge } from '../IChainBridge'
import { IInclusionService, InclusionServiceConfig } from './inclusion/IInclusionService'
import { config as globalConfig } from 'src/config'
import { networkSlugToId } from 'src/utils/networkSlugToId'
import { providers } from 'ethers'

class OptimismBridge extends AbstractChainBridge implements IChainBridge {
  csm: CrossChainMessenger
  derive: Derive = new Derive()
  inclusionService: IInclusionService | undefined

  constructor (chainSlug: string) {
    super(chainSlug)

    this.csm = new CrossChainMessenger({
      bedrock: true,
      l1ChainId: networkSlugToId(globalConfig.network),
      l2ChainId: this.chainId,
      l1SignerOrProvider: this.l1Wallet,
      l2SignerOrProvider: this.l2Wallet
    })

    const inclusionServiceConfig: InclusionServiceConfig = {
      chainSlug: this.chainSlug,
      l1Wallet: this.l1Wallet,
      l2Wallet: this.l2Wallet,
      logger: this.logger
    }

    this.inclusionService = new AlchemyInclusionService(inclusionServiceConfig)
  }

  async relayL1ToL2Message (l1TxHash: string): Promise<providers.TransactionResponse> {
    try {
      // Need an arbitrary value that will always succeed
      const gasLimit = 1000000
      const message = await this.csm.toCrossChainMessage(l1TxHash)
      // Signer is needed to execute tx with SDK
      const txOpts: any = {
        signer: this.l2Wallet,
        overrides: {
          gasLimit
        }
      }
      return this.csm.resendMessage(message, txOpts)
    } catch (err) {
      throw new Error(`relayL1ToL2Message error: ${err.message}`)
    }
  }

  // This function will only handle one stage at a time. Upon completion of a stage, the poller will re-call
  // this when the next stage is ready.
  // It is expected that the poller re-calls this message every hour during the challenge period, if the
  // transfer was challenged. The complexity of adding DB state to track successful/failed root prove txs
  // and challenges is not worth saving the additional RPC calls (2) per hour during the challenge period.
  async relayL2ToL1Message (l2TxHash: string): Promise<providers.TransactionResponse> {
    const messageStatus: MessageStatus = await this.csm.getMessageStatus(l2TxHash)
    if (
      messageStatus === MessageStatus.UNCONFIRMED_L1_TO_L2_MESSAGE ||
      messageStatus === MessageStatus.FAILED_L1_TO_L2_MESSAGE ||
      messageStatus === MessageStatus.RELAYED
    ) {
      throw new Error(`unexpected message status: ${messageStatus}, l2TxHash: ${l2TxHash}`)
    }

    if (messageStatus === MessageStatus.STATE_ROOT_NOT_PUBLISHED) {
      throw new Error('state root not published')
    }

    if (messageStatus === MessageStatus.READY_TO_PROVE) {
      this.logger.info('sending proveMessage tx')
      const resolved = await this.csm.toCrossChainMessage(l2TxHash)
      return this.csm.proveMessage(resolved)
    }

    if (messageStatus === MessageStatus.IN_CHALLENGE_PERIOD) {
      throw new Error('message in challenge period')
    }

    if (messageStatus === MessageStatus.READY_FOR_RELAY) {
      this.logger.info('sending finalizeMessage tx')
      const overrides: any = {
        gasLimit: CanonicalMessengerRootConfirmationGasLimit
      }
      return this.csm.finalizeMessage(l2TxHash, { overrides })
    }

    throw new Error(`state not handled for tx ${l2TxHash}`)
  }

  async getL1InclusionTx (l2TxHash: string): Promise<providers.TransactionReceipt | undefined> {
    if (!this.inclusionService) return
    return this.inclusionService.getL1InclusionTx(l2TxHash)
  }

  async getL2InclusionTx (l1TxHash: string): Promise<providers.TransactionReceipt | undefined> {
    if (!this.inclusionService) return
    return this.inclusionService.getL2InclusionTx(l1TxHash)
  }

  async getCustomBlockNumber (blockTag: FinalityBlockTag): Promise<number | undefined> {
    if (!this.#isCustomBlockNumberSupported(blockTag)) {
      throw new Error(`getCustomBlockNumber: blockTag ${blockTag} not supported`)
    }

    // Use a cache since the granularity of finality updates on l1 is on the order of minutes
    const customBlockNumberCacheKey = `${this.chainSlug}-${blockTag}`
    const cacheValue = this.getCacheValue(customBlockNumberCacheKey)
    if (cacheValue) {
      this.logger.debug('getCustomBlockNumber: using cached value')
      return cacheValue
    }

    const customBlockNumber = await this.#getCustomBlockNumber(blockTag)
    if (!customBlockNumber) {
      this.logger.error('getCustomBlockNumber: no customBlockNumber found')
      return
    }

    this.updateCache(customBlockNumberCacheKey, customBlockNumber)
    return customBlockNumber
  }

  async #getCustomBlockNumber (blockTag: FinalityBlockTag): Promise<number | undefined> {
    if (
      !this.inclusionService?.getLatestL1InclusionTxBeforeBlockNumber ||
      !this.inclusionService?.getLatestL2TxFromL1ChannelTx
    ) {
      this.logger.error('getCustomSafeBlockNumber: includeService not available')
      return
    }

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

    return customSafeBlockNumber
  }

  #isCustomBlockNumberSupported (blockTag: FinalityBlockTag): boolean {
    if (blockTag === FinalityBlockTag.Safe) {
      return true
    }
    return false
  }
}

export default OptimismBridge
