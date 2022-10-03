import '../moduleAlias'
import ArbitrumBridgeWatcher from './ArbitrumBridgeWatcher'
import BaseWatcher from './classes/BaseWatcher'
import GnosisBridgeWatcher from './GnosisBridgeWatcher'
import L1Bridge from './classes/L1Bridge'
import MessengerWrapper from './classes/MessengerWrapper'
import OptimismBridgeWatcher from './OptimismBridgeWatcher'
import PolygonBridgeWatcher from './PolygonBridgeWatcher'
import { BigNumber } from 'ethers'
import { Chain } from 'src/constants'
import { ExitableTransferRoot } from 'src/db/TransferRootsDb'
import { L1Bridge as L1BridgeContract } from '@hop-protocol/core/contracts/L1Bridge'
import { L2Bridge as L2BridgeContract } from '@hop-protocol/core/contracts/L2Bridge'
import { MessengerWrapper as MessengerWrapperContract } from '@hop-protocol/core/contracts/MessengerWrapper'
import { getEnabledNetworks } from 'src/config'
import contracts from 'src/contracts'

type Config = {
  chainSlug: string
  tokenSymbol: string
  bridgeContract: L1BridgeContract | L2BridgeContract
  l1BridgeContract: L1BridgeContract
  dryMode?: boolean
}

type ConfirmRootData = {
  rootHash: string
  destinationChainId: number
  totalAmount: string | BigNumber
  rootCommittedAt: number
}

type Watcher = GnosisBridgeWatcher | PolygonBridgeWatcher | OptimismBridgeWatcher | ArbitrumBridgeWatcher

class xDomainMessageRelayWatcher extends BaseWatcher {
  l1Bridge: L1Bridge
  lastSeen: {[key: string]: number} = {}
  watchers: {[chain: string]: Watcher} = {}
  messengerWrapper: MessengerWrapper

  constructor (config: Config) {
    super({
      chainSlug: config.chainSlug,
      tokenSymbol: config.tokenSymbol,
      logColor: 'yellow',
      bridgeContract: config.bridgeContract,
      dryMode: config.dryMode
    })
    this.logger.debug('starting watcher')
    const enabledNetworks = getEnabledNetworks()
    this.l1Bridge = new L1Bridge(config.l1BridgeContract)
    if (this.chainSlug === Chain.Gnosis && enabledNetworks.includes(Chain.Gnosis)) {
      this.watchers[Chain.Gnosis] = new GnosisBridgeWatcher({
        chainSlug: config.chainSlug,
        tokenSymbol: this.tokenSymbol,
        l1BridgeContract: config.l1BridgeContract,
        bridgeContract: config.bridgeContract,
        dryMode: config.dryMode
      })
    }
    if (this.chainSlug === Chain.Polygon && enabledNetworks.includes(Chain.Polygon)) {
      this.watchers[Chain.Polygon] = new PolygonBridgeWatcher({
        chainSlug: config.chainSlug,
        tokenSymbol: this.tokenSymbol,
        bridgeContract: config.bridgeContract,
        dryMode: config.dryMode
      })
    }
    if (this.chainSlug === Chain.Optimism && enabledNetworks.includes(Chain.Optimism)) {
      this.watchers[Chain.Optimism] = new OptimismBridgeWatcher({
        chainSlug: config.chainSlug,
        tokenSymbol: this.tokenSymbol,
        bridgeContract: config.bridgeContract,
        dryMode: config.dryMode
      })
    }
    if (this.chainSlug === Chain.Arbitrum && enabledNetworks.includes(Chain.Arbitrum)) {
      this.watchers[Chain.Arbitrum] = new ArbitrumBridgeWatcher({
        chainSlug: config.chainSlug,
        tokenSymbol: this.tokenSymbol,
        bridgeContract: config.bridgeContract,
        dryMode: config.dryMode
      })
    }


    const messengerWrapperContract: MessengerWrapperContract = contracts.get(this.tokenSymbol, this.chainSlug)?.messengerWrapper
    if (!messengerWrapperContract) {
      throw new Error(`Messenger wrapper contract not found for ${this.chainSlug}.${this.tokenSymbol}`)
    }
    this.messengerWrapper = new MessengerWrapper(messengerWrapperContract)

    // xDomain relayer is less time sensitive than others
    this.pollIntervalMs = 10 * 60 * 1000
  }

  async pollHandler () {
    await this.checkTransfersCommittedFromDb()
  }

  async checkTransfersCommittedFromDb () {
    const dbTransferRoots = await this.db.transferRoots.getExitableTransferRoots(await this.getFilterRoute())
    if (!dbTransferRoots.length) {
      return
    }
    this.logger.debug(
      `checking ${dbTransferRoots.length} unconfirmed transfer roots db items`
    )
    for (const { transferRootId } of dbTransferRoots) {
      // Parallelizing these calls produces RPC errors on Optimism
      await this.checkTransfersCommitted(transferRootId)
    }
  }

  async checkTransfersCommitted (transferRootId: string) {
    const dbTransferRoot = await this.db.transferRoots.getByTransferRootId(transferRootId) as ExitableTransferRoot
    if (!dbTransferRoot) {
      throw new Error(`transfer root db item not found, root id "${transferRootId}"`)
    }

    const { destinationChainId, commitTxHash } = dbTransferRoot

    const logger = this.logger.create({ root: transferRootId })
    const chainSlug = this.chainIdToSlug(await this.bridge.getChainId())
    const isTransferRootIdConfirmed = await this.l1Bridge.isTransferRootIdConfirmed(
      destinationChainId,
      transferRootId
    )
    if (isTransferRootIdConfirmed) {
      logger.warn('Transfer root already confirmed')
      await this.db.transferRoots.update(transferRootId, {
        confirmed: true
      })
      return
    }

    const watcher = this.watchers[chainSlug]
    if (!watcher) {
      logger.warn(`exit watcher for ${chainSlug} is not implemented yet`)
      return
    }

    logger.debug(`handling commit tx hash ${commitTxHash} from ${destinationChainId}`)
    await watcher.handleCommitTxHash(commitTxHash, transferRootId, logger)
  }

  async redeemArbitrumTransaction (l1TxHash: string, chainSlug: string, messageIndex: number = 0) {
    const watcher = this.watchers[chainSlug] as ArbitrumBridgeWatcher
    if (!watcher) {
      this.logger.error('Arbitrum exit watcher is required for this transaction')
      return
    }

    this.logger.debug(`redeeming Arbitrum transaction for L1 tx: ${l1TxHash}`)
    await watcher.redeemArbitrumTransaction(l1TxHash, messageIndex)
  }

  async confirmRootsViaWrapper (rootData: ConfirmRootData[]): Promise<void> {
    const rootHashes: string[] = []
    const destinationChainIds: number[] = []
    const totalAmounts: BigNumber[] = []
    const rootCommittedAt: number[] = []
    for (const data of rootData) {
      rootHashes.push(data.rootHash),
      destinationChainIds.push(data.destinationChainId),
      totalAmounts.push(BigNumber.from(data.totalAmount)),
      rootCommittedAt.push(data.rootCommittedAt)
    }
    this.messengerWrapper.confirmRoots(
      rootHashes,
      destinationChainIds,
      totalAmounts,
      rootCommittedAt,
    )
  }
}

export default xDomainMessageRelayWatcher
