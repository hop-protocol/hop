import '../moduleAlias'
import ArbitrumBridgeWatcher from './ArbitrumBridgeWatcher'
import BaseWatcher from './classes/BaseWatcher'
import BaseZkBridgeWatcher from './chains/optimism/BaseZkBridgeWatcher'
import Logger from 'src/logger'
import OptimismBridgeWatcher from './chains/optimism/OptimismBridgeWatcher'
import PolygonZkBridgeWatcher from './PolygonZkBridgeWatcher'
import isNativeToken from 'src/utils/isNativeToken'
import { Chain, GasCostTransactionType, TxError } from 'src/constants'
import { L1_Bridge as L1BridgeContract } from '@hop-protocol/core/contracts/generated/L1_Bridge'
import { L2_Bridge as L2BridgeContract } from '@hop-protocol/core/contracts/generated/L2_Bridge'
import { NonceTooLowError, RelayerFeeTooLowError } from 'src/types/error'
import { RelayableTransferRoot } from 'src/db/TransferRootsDb'
import { RelayL1ToL2MessageOpts } from 'src/watchers/classes/IChainWatcher'
import { Transfer, UnrelayedSentTransfer } from 'src/db/TransfersDb'
import { getEnabledNetworks, config as globalConfig, relayTransactionBatchSize } from 'src/config'
import { isFetchExecutionError } from 'src/utils/isFetchExecutionError'
import { isFetchRpcServerError } from 'src/utils/isFetchRpcServerError'
import { promiseQueue } from 'src/utils/promiseQueue'
import { providers } from 'ethers'

type Config = {
  chainSlug: string
  tokenSymbol: string
  bridgeContract: L1BridgeContract | L2BridgeContract
  dryMode?: boolean
}

type RelayWatchers = OptimismBridgeWatcher | ArbitrumBridgeWatcher | PolygonZkBridgeWatcher | BaseZkBridgeWatcher

class RelayWatcher extends BaseWatcher {
  siblingWatchers: { [chainId: string]: RelayWatcher }
  relayWatchers: { [chainId: number]: RelayWatchers } = {}

  constructor (config: Config) {
    super({
      chainSlug: config.chainSlug,
      tokenSymbol: config.tokenSymbol,
      logColor: 'redBright',
      bridgeContract: config.bridgeContract,
      dryMode: config.dryMode
    })

    const enabledNetworks = getEnabledNetworks()

    if (enabledNetworks.includes(Chain.Optimism)) {
      const optimismChainId = this.chainSlugToId(Chain.Optimism)
      this.relayWatchers[optimismChainId] = new OptimismBridgeWatcher({
        chainSlug: Chain.Optimism,
        tokenSymbol: this.tokenSymbol,
        bridgeContract: config.bridgeContract,
        dryMode: config.dryMode
      })
    }

    if (enabledNetworks.includes(Chain.Arbitrum)) {
      const arbitrumChainId = this.chainSlugToId(Chain.Arbitrum)
      this.relayWatchers[arbitrumChainId] = new ArbitrumBridgeWatcher({
        chainSlug: Chain.Arbitrum,
        tokenSymbol: this.tokenSymbol,
        bridgeContract: config.bridgeContract,
        dryMode: config.dryMode
      })
    }

    if (enabledNetworks.includes(Chain.Nova)) {
      const novaChainId = this.chainSlugToId(Chain.Nova)
      this.relayWatchers[novaChainId] = new ArbitrumBridgeWatcher({
        chainSlug: Chain.Nova,
        tokenSymbol: this.tokenSymbol,
        bridgeContract: config.bridgeContract,
        dryMode: config.dryMode
      })
    }

    if (enabledNetworks.includes(Chain.PolygonZk)) {
      const polygonzkChainId = this.chainSlugToId(Chain.PolygonZk)
      this.relayWatchers[polygonzkChainId] = new PolygonZkBridgeWatcher({
        chainSlug: Chain.PolygonZk,
        tokenSymbol: this.tokenSymbol,
        bridgeContract: config.bridgeContract,
        dryMode: config.dryMode
      })
    }

    if (enabledNetworks.includes(Chain.Base)) {
      const baseChainId = this.chainSlugToId(Chain.Base)
      this.relayWatchers[baseChainId] = new BaseZkBridgeWatcher({
        chainSlug: Chain.Base,
        tokenSymbol: this.tokenSymbol,
        bridgeContract: config.bridgeContract,
        dryMode: config.dryMode
      })
    }
  }

  async pollHandler () {
    await Promise.all([
      this.checkTransferSentToL2FromDb(),
      this.checkRelayableTransferRootsFromDb()
    ])
    this.logger.debug('RelayWatcher pollHandler completed')
  }

  async checkTransferSentToL2FromDb () {
    const dbTransfers = await this.db.transfers.getUnrelayedSentTransfers(await this.getFilterRoute())
    if (!dbTransfers.length) {
      this.logger.debug('no unrelayed transfer db items to check')
      return
    }

    this.logger.info(
      `total unrelayed transfers db items: ${dbTransfers.length}`
    )

    const listSize = 100
    const batchedDbTransfers = dbTransfers.slice(0, listSize)

    this.logger.info(
      `checking unrelayed transfers db items ${batchedDbTransfers.length} (out of ${dbTransfers.length})`
    )

    await promiseQueue(batchedDbTransfers, async (dbTransfer: Transfer, i: number) => {
      const {
        transferId
      } = dbTransfer
      const logger = this.logger.create({ id: transferId })
      logger.debug(`processing item ${i + 1}/${batchedDbTransfers.length} start`)
      logger.debug('checking db poll')

      try {
        logger.debug('checkTransferSentToL2 start')
        await this.checkTransferSentToL2(transferId)
      } catch (err: any) {
        logger.error('checkTransferSentToL2 error:', err)
      }

      logger.debug(`processing item ${i + 1}/${batchedDbTransfers.length} complete`)
      logger.debug('db poll completed')
    }, { concurrency: relayTransactionBatchSize, timeoutMs: 10 * 60 * 1000 })

    this.logger.debug('checkTransferSentToL2FromDb completed')
  }

  async checkRelayableTransferRootsFromDb () {
    const dbTransferRoots = await this.db.transferRoots.getRelayableTransferRoots(await this.getFilterRoute())
    if (!dbTransferRoots.length) {
      this.logger.debug('no relayable transfer root db items to check')
      return
    }

    this.logger.info(
        `checking ${dbTransferRoots.length} unrelayed transfer roots db items`
    )

    const promises: Array<Promise<any>> = []
    for (const dbTransferRoot of dbTransferRoots) {
      const { transferRootId } = dbTransferRoot
      promises.push(this.checkRelayableTransferRoots(transferRootId))
    }

    await Promise.all(promises)
    this.logger.debug('checkRelayableTransferRootsFromDb completed')
  }

  async checkTransferSentToL2 (transferId: string) {
    const dbTransfer = await this.db.transfers.getByTransferId(transferId) as UnrelayedSentTransfer
    if (!dbTransfer) {
      this.logger.warn(`transfer id "${transferId}" not found in db`)
      return
    }
    const {
      sourceChainId,
      destinationChainId,
      recipient,
      amount,
      relayer,
      relayerFee,
      transferSentTimestamp,
      transferSentTxHash
    } = dbTransfer
    const logger: Logger = this.logger.create({ id: transferId })
    logger.debug('processing transfer relay')
    logger.debug('amount:', amount && this.bridge.formatUnits(amount))
    logger.debug('recipient:', recipient)
    logger.debug('relayer:', relayer)
    logger.debug('relayerFee:', relayerFee && this.bridge.formatUnits(relayerFee))

    const destBridge = this.getSiblingWatcherByChainId(destinationChainId)
      .bridge

    const bonderAddress = await destBridge.getBonderAddress()
    const isCorrectRelayer = bonderAddress.toLowerCase() === relayer.toLowerCase()
    if (!isCorrectRelayer) {
      // Re-introduce when enforcing
      logger.debug('relayer address is not correct')
      // logger.warn('relayer is not correct. marking item not relayable.')
      // await this.db.transfers.update(transferId, { isRelayable: false })
      // return
    }

    const isReceivingNativeToken = isNativeToken(destBridge.chainSlug, this.tokenSymbol)
    if (isReceivingNativeToken) {
      logger.debug('checkTransferSentToL2 getIsRecipientReceivable')
      const isRecipientReceivable = await this.getIsRecipientReceivable(recipient, destBridge, logger)
      logger.debug(`processing relay. isRecipientReceivable: ${isRecipientReceivable}`)
      if (!isRecipientReceivable) {
        logger.warn('recipient cannot receive transfer. marking item not relayable')
        await this.db.transfers.update(transferId, { isRelayable: false })
        return
      }
    }

    if (this.dryMode || globalConfig.emergencyDryMode) {
      logger.warn(`dry: ${this.dryMode}, emergencyDryMode: ${globalConfig.emergencyDryMode}, skipping relayWatcher`)
      return
    }

    logger.debug('attempting to send relay tx')

    await this.db.transfers.update(transferId, {
      relayAttemptedAt: Date.now()
    })

    try {
      logger.debug('checkTransferSentToL2 getIsRelayerFeeOk')
      const isRelayerFeeOk = await this.getIsFeeOk(transferId, GasCostTransactionType.Relay)
      if (!isRelayerFeeOk) {
        // Re-introduce when enforcing
        logger.debug('relayer fee is too low')
        // const msg = 'Relayer fee is too low. Cannot relay.'
        // logger.warn(msg)
        // this.notifier.warn(msg)
        // throw new RelayerFeeTooLowError(msg)
      }

      const relayL1ToL2MessageOpts: RelayL1ToL2MessageOpts = {}
      logger.debug('checkTransferSentToL2 sendRelayTx')
      const tx = await this.sendTransferRelayTx({
        transferId,
        destinationChainId,
        transferSentTxHash,
        relayL1ToL2MessageOpts
      })

      // This will not work as intended if the process restarts after the tx is sent but before this is executed.
      // This is expected because we cannot watch for the event because it does not emit enough info for a unique DB entry
      // since the L1 to L2 transferId relies on the L1 transaction hash. If the server does restart, we will be alerted
      // that a tx has not been relayed and we can investigate the status.
      await this.db.transfers.update(transferId, {
        transferFromL1Complete: true,
        transferFromL1CompleteTxHash: tx.hash
      })

      const msg = `sent relay on ${destinationChainId} (source chain ${sourceChainId}) tx: ${tx.hash} transferId: ${transferId}`
      logger.info(msg)
      this.notifier.info(msg)
    } catch (err: any) {
      // For this watcher, we will always mark the transfer as incomplete if the process gets here
      await this.db.transfers.update(transferId, {
        transferFromL1Complete: false,
        transferFromL1CompleteTxHash: undefined
      })

      logger.error('relayTx error:', err.message)
      const isUnrelayableError = /Blacklistable: account is blacklisted/i.test(err.message)
      if (isUnrelayableError) {
        logger.debug(`marking as unrelayable due to error: ${err.message}`)
        await this.db.transfers.update(transferId, {
          isRelayable: false
        })
      }

      const isCallExceptionError = isFetchExecutionError(err.message)
      if (isCallExceptionError) {
        await this.db.transfers.update(transferId, {
          relayTxError: TxError.CallException
        })
      }
      if (err instanceof RelayerFeeTooLowError) {
        let relayBackoffIndex = await this.db.transfers.getRelayBackoffIndexForTransferId(transferId)
        relayBackoffIndex++
        await this.db.transfers.update(transferId, {
          relayTxError: TxError.RelayerFeeTooLow,
          relayBackoffIndex
        })
        return
      }
      if (err instanceof NonceTooLowError) {
        logger.error('nonce too low. trying again.')
        await this.db.transfers.update(transferId, {
          relayAttemptedAt: 0
        })
      }
      const isRpcError = isFetchRpcServerError(err.message)
      if (isRpcError) {
        logger.error('rpc server error. trying again.')
        let relayBackoffIndex = await this.db.transfers.getRelayBackoffIndexForTransferId(transferId)
        relayBackoffIndex++
        await this.db.transfers.update(transferId, {
          relayTxError: TxError.RpcServerError,
          relayBackoffIndex
        })
        return
      }
      throw err
    }
  }

  async checkRelayableTransferRoots (transferRootId: string) {
    const dbTransferRoot = await this.db.transferRoots.getByTransferRootId(transferRootId) as RelayableTransferRoot
    if (!dbTransferRoot) {
      this.logger.warn(`transferRoot id "${transferRootId}" not found in db`)
      return
    }
    const {
      transferRootHash,
      totalAmount,
      destinationChainId,
      bondTxHash,
      confirmTxHash
    } = dbTransferRoot

    const logger = this.logger.create({ root: transferRootId })

    // bondTxHash should be checked first because a root can have both but it should be bonded prior to being confirmed
    const l1TxHash = bondTxHash ?? confirmTxHash
    if (!l1TxHash) {
      logger.warn('No l1TxHash found.')
      await this.db.transferRoots.update(transferRootId, { isNotFound: true })
      return
    }

    logger.debug('processing transfer root relay')
    logger.debug('transferRootHash:', transferRootHash)
    logger.debug('totalAmount:', totalAmount.toString())
    logger.debug('destinationChainId:', destinationChainId)
    logger.debug('l1txHash:', l1TxHash)

    const isSet = await this.bridge.isTransferRootSet(transferRootHash, totalAmount)
    if (isSet) {
      logger.warn('checkRelayableTransferRoots already set. marking item not found.')
      await this.db.transferRoots.update(transferRootId, { isNotFound: true })
      return
    }

    if (this.dryMode || globalConfig.emergencyDryMode) {
      logger.warn(`dry: ${this.dryMode}, emergencyDryMode: ${globalConfig.emergencyDryMode}, skipping bondTransferRoot`)
      return
    }

    logger.debug(
      `attempting to relay root id ${transferRootId} with destination chain ${destinationChainId} and l1TxHash ${l1TxHash}`
    )

    await this.db.transferRoots.update(transferRootId, {
      sentRelayTxAt: Date.now()
    })

    try {
      const tx = await this.sendTransferRootRelayTx(
        destinationChainId,
        transferRootId,
        l1TxHash
      )
      const msg = `transferRootSet dest ${destinationChainId}, tx ${tx.hash} transferRootHash: ${transferRootHash}`
      logger.info(msg)
      this.notifier.info(msg)
    } catch (err) {
      logger.error('transferRootSet error:', err.message)
      throw err
    }
  }

  async sendTransferRelayTx (params: any): Promise<providers.TransactionResponse> {
    const {
      transferId,
      destinationChainId,
      transferSentTxHash,
      relayL1ToL2MessageOpts
    } = params
    const logger = this.logger.create({ id: transferId })

    logger.debug(
      `relay transfer destinationChainId: ${destinationChainId} with relayL1ToL2MessageOpts ${JSON.stringify(relayL1ToL2MessageOpts) ?? ''} l1TxHash: ${transferSentTxHash}`
    )
    logger.debug('checkTransferSentToL2 l2Bridge.distribute')
    return await this.sendRelayTx(destinationChainId, transferSentTxHash, relayL1ToL2MessageOpts)
  }

  async sendTransferRootRelayTx (destinationChainId: number, transferRootId: string, txHash: string): Promise<providers.TransactionResponse> {
    const logger = this.logger.create({ root: transferRootId })
    logger.debug(
      `relay root destinationChainId with txHash ${txHash}`
    )
    return await this.sendRelayTx(destinationChainId, txHash)
  }

  async sendRelayTx (destinationChainId: number, txHash: string, relayL1ToL2MessageOpts?: RelayL1ToL2MessageOpts): Promise<providers.TransactionResponse> {
    if (!this.relayWatchers[destinationChainId]) {
      throw new Error(`RelayWatcher: sendRelayTx: no relay watcher for destination chain id "${destinationChainId}", tx hash "${txHash}"`)
    }

    this.logger.debug(`attempting relayWatcher relayL1ToL2Message() l1TxHash: ${txHash} relayL1ToL2MessageOpts ${JSON.stringify(relayL1ToL2MessageOpts) ?? ''} destinationChainId: ${destinationChainId}`)
    return await this.relayWatchers[destinationChainId].relayL1ToL2Message(txHash, relayL1ToL2MessageOpts)
  }
}

export default RelayWatcher
