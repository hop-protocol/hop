import '../moduleAlias'
import ArbitrumBridgeWatcher from './ArbitrumBridgeWatcher'
import BaseWatcher from './classes/BaseWatcher'
import BaseZkBridgeWatcher from './BaseZkBridgeWatcher'
import ConsenSysZkBridgeWatcher from './ConsenSysZkBridgeWatcher'
import GnosisBridgeWatcher from './GnosisBridgeWatcher'
import L1Bridge from './classes/L1Bridge'
import L1MessengerWrapper from './classes/L1MessengerWrapper'
import NovaBridgeWatcher from './NovaBridgeWatcher'
import OptimismBridgeWatcher from './OptimismBridgeWatcher'
import PolygonBridgeWatcher from './PolygonBridgeWatcher'
import ZkSyncBridgeWatcher from './ZkSyncBridgeWatcher'
import contracts from 'src/contracts'
import { BigNumber } from 'ethers'
import { Chain } from 'src/constants'
import { ExitableTransferRoot } from 'src/db/TransferRootsDb'
import { L1Bridge as L1BridgeContract } from '@hop-protocol/core/contracts/L1Bridge'
import { MessengerWrapper as L1MessengerWrapperContract } from '@hop-protocol/core/contracts/MessengerWrapper'
import { L2Bridge as L2BridgeContract } from '@hop-protocol/core/contracts/L2Bridge'
import { getEnabledNetworks } from 'src/config'

type Config = {
  chainSlug: string
  tokenSymbol: string
  bridgeContract: L1BridgeContract | L2BridgeContract
  l1BridgeContract: L1BridgeContract
  dryMode?: boolean
}

export type ConfirmRootsData = {
  rootHash: string
  destinationChainId: number
  totalAmount: BigNumber
  rootCommittedAt: number
}

type Watcher = GnosisBridgeWatcher | PolygonBridgeWatcher | OptimismBridgeWatcher | BaseZkBridgeWatcher | ArbitrumBridgeWatcher | NovaBridgeWatcher | ZkSyncBridgeWatcher | ConsenSysZkBridgeWatcher

class ConfirmRootsWatcher extends BaseWatcher {
  l1Bridge: L1Bridge
  lastSeen: {[key: string]: number} = {}
  watchers: {[chain: string]: Watcher} = {}
  l1MessengerWrapper: L1MessengerWrapper

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
    if (this.chainSlug === Chain.Base && enabledNetworks.includes(Chain.Base)) {
      this.watchers[Chain.Base] = new BaseZkBridgeWatcher({
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
    if (this.chainSlug === Chain.Nova && enabledNetworks.includes(Chain.Nova)) {
      this.watchers[Chain.Nova] = new NovaBridgeWatcher({
        chainSlug: config.chainSlug,
        tokenSymbol: this.tokenSymbol,
        bridgeContract: config.bridgeContract,
        dryMode: config.dryMode
      })
    }
    if (this.chainSlug === Chain.ZkSync && enabledNetworks.includes(Chain.ZkSync)) {
      this.watchers[Chain.ZkSync] = new ZkSyncBridgeWatcher({
        chainSlug: config.chainSlug,
        tokenSymbol: this.tokenSymbol,
        bridgeContract: config.bridgeContract,
        dryMode: config.dryMode
      })
    }
    if (this.chainSlug === Chain.ConsenSysZk && enabledNetworks.includes(Chain.ConsenSysZk)) {
      this.watchers[Chain.ConsenSysZk] = new ConsenSysZkBridgeWatcher({
        chainSlug: config.chainSlug,
        tokenSymbol: this.tokenSymbol,
        bridgeContract: config.bridgeContract,
        dryMode: config.dryMode
      })
    }

    const l1MessengerWrapperContract: L1MessengerWrapperContract = contracts.get(this.tokenSymbol, this.chainSlug)?.l1MessengerWrapper
    if (!l1MessengerWrapperContract) {
      throw new Error(`Messenger wrapper contract not found for ${this.chainSlug}.${this.tokenSymbol}`)
    }
    this.l1MessengerWrapper = new L1MessengerWrapper(l1MessengerWrapperContract)

    // confirmation watcher is less time sensitive than others
    this.pollIntervalMs = 10 * 60 * 1000
  }

  async pollHandler () {
    try {
      await Promise.all([
        this.checkExitableTransferRootsFromDb(),
        this.checkConfirmableTransferRootsFromDb()
      ])
      this.logger.debug('confirmRootsWatcher pollHandler completed')
    } catch (err) {
      this.logger.debug(`confirmRootsWatcher pollHandler error ${err.message}`)
    }
  }

  async checkExitableTransferRootsFromDb () {
    const dbTransferRoots = await this.db.transferRoots.getExitableTransferRoots(await this.getFilterRoute())
    if (!dbTransferRoots.length) {
      return
    }
    this.logger.debug(
      `checking ${dbTransferRoots.length} unexited transfer roots db items`
    )
    for (const { transferRootId } of dbTransferRoots) {
      await this.checkExitableTransferRoots(transferRootId)
    }
  }

  async checkConfirmableTransferRootsFromDb () {
    const dbTransferRoots = await this.db.transferRoots.getConfirmableTransferRoots(await this.getFilterRoute())
    if (!dbTransferRoots.length) {
      return
    }
    this.logger.debug(
      `checking ${dbTransferRoots.length} unconfirmed transfer roots db items`
    )
    for (const { transferRootId } of dbTransferRoots) {
      await this.checkConfirmableTransferRoots(transferRootId)
    }
  }

  async checkExitableTransferRoots (transferRootId: string) {
    const dbTransferRoot = await this.db.transferRoots.getByTransferRootId(transferRootId) as ExitableTransferRoot
    if (!dbTransferRoot) {
      throw new Error(`transfer root db item not found, root id "${transferRootId}"`)
    }

    const { destinationChainId, commitTxHash } = dbTransferRoot

    const logger = this.logger.create({ root: transferRootId })
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

    const chainSlug = this.chainIdToSlug(await this.bridge.getChainId())
    const watcher = this.watchers[chainSlug]
    if (!watcher) {
      logger.warn(`exit watcher for ${chainSlug} is not implemented yet`)
      return
    }

    logger.debug(`handling commit tx hash ${commitTxHash} to ${destinationChainId}`)
    await watcher.handleCommitTxHash(commitTxHash, transferRootId, logger)
  }

  async checkConfirmableTransferRoots (transferRootId: string) {
    const dbTransferRoot = await this.db.transferRoots.getByTransferRootId(transferRootId) as ExitableTransferRoot
    if (!dbTransferRoot) {
      throw new Error(`transfer root db item not found, root id "${transferRootId}"`)
    }

    const { transferRootHash, destinationChainId, totalAmount, committedAt } = dbTransferRoot

    const logger = this.logger.create({ root: transferRootId })
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

    if (this.dryMode) {
      this.logger.warn(`dry: ${this.dryMode}, skipping confirmRootsViaWrapper`)
      return
    }

    await this.db.transferRoots.update(transferRootId, {
      sentConfirmTxAt: Date.now()
    })

    logger.debug(`handling confirmable transfer root ${transferRootHash}, destination ${destinationChainId}, amount ${totalAmount.toString()}, committedAt ${committedAt}`)
    await this.confirmRootsViaWrapper([{
      rootHash: transferRootHash,
      destinationChainId,
      totalAmount,
      rootCommittedAt: committedAt
    }])
  }

  async confirmRootsViaWrapper (rootData: ConfirmRootsData[]): Promise<void> {
    const rootHashes: string[] = []
    const destinationChainIds: number[] = []
    const totalAmounts: BigNumber[] = []
    const rootCommittedAt: number[] = []
    for (const data of rootData) {
      rootHashes.push(data.rootHash)
      destinationChainIds.push(data.destinationChainId)
      totalAmounts.push(data.totalAmount)
      rootCommittedAt.push(data.rootCommittedAt)
    }
    this.l1MessengerWrapper.confirmRoots(
      rootHashes,
      destinationChainIds,
      totalAmounts,
      rootCommittedAt
    )
  }
}

export default ConfirmRootsWatcher
