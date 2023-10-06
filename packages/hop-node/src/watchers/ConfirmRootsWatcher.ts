import '../moduleAlias'
import ArbitrumBridgeWatcher from './ArbitrumBridgeWatcher'
import BaseBridgeWatcher from './BaseBridgeWatcher'
import BaseWatcher from './classes/BaseWatcher'
import GnosisBridgeWatcher from './GnosisBridgeWatcher'
import L1Bridge from './classes/L1Bridge'
import L1MessengerWrapper from './classes/L1MessengerWrapper'
import LineaBridgeWatcher from './LineaBridgeWatcher'
import NovaBridgeWatcher from './NovaBridgeWatcher'
import OptimismBridgeWatcher from './OptimismBridgeWatcher'
import PolygonBridgeWatcher from './PolygonBridgeWatcher'
import PolygonZkBridgeWatcher from './PolygonZkBridgeWatcher'
import ScrollZkBridgeWatcher from './ScrollZkBridgeWatcher'
import ZkSyncBridgeWatcher from './ZkSyncBridgeWatcher'
import contracts from 'src/contracts'
import getTransferCommitted from 'src/theGraph/getTransferCommitted'
import getTransferRootId from 'src/utils/getTransferRootId'
import { BigNumber } from 'ethers'
import { Chain, ChallengePeriodMs } from 'src/constants'
import { ExitableTransferRoot } from 'src/db/TransferRootsDb'
import { L1_Bridge as L1BridgeContract } from '@hop-protocol/core/contracts/generated/L1_Bridge'
import { MessengerWrapper as L1MessengerWrapperContract } from '@hop-protocol/core/contracts/generated/MessengerWrapper'
import { L2_Bridge as L2BridgeContract } from '@hop-protocol/core/contracts/generated/L2_Bridge'
import { getEnabledNetworks, config as globalConfig } from 'src/config'

type Config = {
  chainSlug: string
  tokenSymbol: string
  bridgeContract: L1BridgeContract | L2BridgeContract
  l1BridgeContract: L1BridgeContract
  dryMode?: boolean
}

export type ConfirmRootsData = {
  rootHashes: string[]
  destinationChainIds: number[]
  totalAmounts: BigNumber[]
  rootCommittedAts: number[]
}

type Watcher = GnosisBridgeWatcher | PolygonBridgeWatcher | PolygonZkBridgeWatcher | BaseBridgeWatcher | ArbitrumBridgeWatcher | NovaBridgeWatcher | ZkSyncBridgeWatcher | LineaBridgeWatcher | ScrollZkBridgeWatcher

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
    const watcherParams = {
      chainSlug: config.chainSlug,
      tokenSymbol: this.tokenSymbol,
      l1BridgeContract: config.l1BridgeContract,
      bridgeContract: config.bridgeContract,
      dryMode: config.dryMode
    }

    if (this.chainSlug === Chain.Gnosis && enabledNetworks.includes(Chain.Gnosis)) {
      this.watchers[Chain.Gnosis] = new GnosisBridgeWatcher(watcherParams)
    }
    if (this.chainSlug === Chain.Polygon && enabledNetworks.includes(Chain.Polygon)) {
      this.watchers[Chain.Polygon] = new PolygonBridgeWatcher(watcherParams)
    }
    if (this.chainSlug === Chain.Optimism && enabledNetworks.includes(Chain.Optimism)) {
      this.watchers[Chain.Optimism] = new OptimismBridgeWatcher(watcherParams)
    }
    if (this.chainSlug === Chain.Arbitrum && enabledNetworks.includes(Chain.Arbitrum)) {
      this.watchers[Chain.Arbitrum] = new ArbitrumBridgeWatcher(watcherParams)
    }
    if (this.chainSlug === Chain.Nova && enabledNetworks.includes(Chain.Nova)) {
      this.watchers[Chain.Nova] = new NovaBridgeWatcher(watcherParams)
    }
    if (this.chainSlug === Chain.ZkSync && enabledNetworks.includes(Chain.ZkSync)) {
      this.watchers[Chain.ZkSync] = new ZkSyncBridgeWatcher(watcherParams)
    }
    if (this.chainSlug === Chain.Linea && enabledNetworks.includes(Chain.Linea)) {
      this.watchers[Chain.Linea] = new LineaBridgeWatcher(watcherParams)
    }
    if (this.chainSlug === Chain.ScrollZk && enabledNetworks.includes(Chain.ScrollZk)) {
      this.watchers[Chain.ScrollZk] = new ScrollZkBridgeWatcher(watcherParams)
    }
    if (this.chainSlug === Chain.Base && enabledNetworks.includes(Chain.Base)) {
      this.watchers[Chain.Base] = new BaseBridgeWatcher(watcherParams)
    }
    if (this.chainSlug === Chain.PolygonZk && enabledNetworks.includes(Chain.PolygonZk)) {
      this.watchers[Chain.PolygonZk] = new PolygonZkBridgeWatcher(watcherParams)
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

    if (this.dryMode || globalConfig.emergencyDryMode) {
      this.logger.warn(`dry: ${this.dryMode}, emergencyDryMode: ${globalConfig.emergencyDryMode}, skipping confirmRootsViaWrapper`)
      return
    }

    await this.db.transferRoots.update(transferRootId, {
      sentConfirmTxAt: Date.now()
    })

    logger.debug(`handling confirmable transfer root ${transferRootHash}, destination ${destinationChainId}, amount ${totalAmount.toString()}, committedAt ${committedAt}`)
    try {
      await this.confirmRootsViaWrapper({
        rootHashes: [transferRootHash],
        destinationChainIds: [destinationChainId],
        totalAmounts: [totalAmount],
        rootCommittedAts: [committedAt]
      })
    } catch (err) {
      logger.error('confirmRootsViaWrapper error:', err.message)
      throw err
    }
  }

  async confirmRootsViaWrapper (rootData: ConfirmRootsData): Promise<void> {
    // NOTE: Since root confirmations via a wrapper can only happen after the challenge period expires, it is not
    // possible for a reorg to occur. Therefore, we do not need to check for a reorg here.
    // Additionally, the validation relies on TheGraph, which is not guaranteed to be available during an emergency.
    // Because of this, we do not enable global emergencyDryMode for this watcher.
    await this.preTransactionValidation(rootData)
    const { rootHashes, destinationChainIds, totalAmounts, rootCommittedAts } = rootData
    await this.l1MessengerWrapper.confirmRoots(
      rootHashes,
      destinationChainIds,
      totalAmounts,
      rootCommittedAts
    )
  }

  async preTransactionValidation (rootData: ConfirmRootsData): Promise<void> {
    const { rootHashes, destinationChainIds, totalAmounts, rootCommittedAts } = rootData

    // Data validation
    if (
      rootHashes.length !== destinationChainIds.length ||
      rootHashes.length !== totalAmounts.length ||
      rootHashes.length !== rootCommittedAts.length
    ) {
      throw new Error('Root data arrays must be the same length')
    }

    for (const [index, value] of rootHashes.entries()) {
      const rootHash = value
      const destinationChainId = destinationChainIds[index]
      const totalAmount = totalAmounts[index]
      const rootCommittedAt = rootCommittedAts[index]

      // Verify that the DB has the root and associated data
      const calculatedTransferRootId = getTransferRootId(rootHash, totalAmount)
      const logger = this.logger.create({ root: calculatedTransferRootId })

      const dbTransferRoot = await this.db.transferRoots.getByTransferRootId(calculatedTransferRootId)
      if (!dbTransferRoot) {
        throw new Error(`Calculated calculatedTransferRootId (${calculatedTransferRootId}) does not match transferRootId in db`)
      }

      logger.debug(`confirming rootHash ${rootHash} on destinationChainId ${destinationChainId} with totalAmount ${totalAmount.toString()} and committedAt ${rootCommittedAt}`)

      // Verify that the data in the DB matches the data passed in
      if (
        rootHash !== dbTransferRoot?.transferRootHash ||
        destinationChainId !== dbTransferRoot?.destinationChainId ||
        totalAmount.toString() !== dbTransferRoot?.totalAmount?.toString() ||
        rootCommittedAt !== dbTransferRoot?.committedAt
      ) {
        throw new Error(`DB data does not match passed in data for rootHash ${rootHash}`)
      }

      // Verify that the watcher is on the correct chain
      if (this.bridge.chainId !== dbTransferRoot.sourceChainId) {
        throw new Error(`Watcher is on chain ${this.bridge.chainId} but transfer root ${calculatedTransferRootId} source is on chain ${dbTransferRoot.sourceChainId}`)
      }

      if (this.bridge.chainId === destinationChainId) {
        throw new Error(`Cannot confirm roots with a destination chain ${destinationChainId} from chain the same chain`)
      }

      // Verify that the transfer root ID is not confirmed for any chain
      // Note: Manually get all chains from config here to check all possible destinations, not
      // just the chains scoped to this watcher
      const allChainIds: number[] = []
      for (const key in globalConfig.networks) {
        const { chainId } = globalConfig.networks[key]
        allChainIds.push(chainId)
      }

      for (const chainId of allChainIds) {
        const isTransferRootIdConfirmed = await this.l1Bridge.isTransferRootIdConfirmed(
          chainId,
          calculatedTransferRootId
        )
        if (isTransferRootIdConfirmed) {
          throw new Error(`Transfer root ${calculatedTransferRootId} already confirmed on chain ${destinationChainId} (confirmRootsViaWrapper)`)
        }
      }

      // Verify that the wrapper being used is correct
      const wrapperL2ChainId = await this.l1MessengerWrapper.l2ChainId()
      if (
        Number(wrapperL2ChainId) !== dbTransferRoot?.sourceChainId ||
        Number(wrapperL2ChainId) !== this.bridge.chainId
      ) {
        throw new Error(`Wrapper l2ChainId is unexpected: ${wrapperL2ChainId} (expected ${dbTransferRoot?.sourceChainId})`)
      }

      // Verify that the root can be confirmed
      const { createdAt, challengeStartTime } = await this.l1Bridge.getTransferBond(calculatedTransferRootId)
      if (!createdAt || !challengeStartTime) {
        throw new Error('Transfer bond not found')
      }
      const createdAtMs = Number(createdAt) * 1000
      const timeSinceBondCreation = Date.now() - createdAtMs
      if (
        createdAt.toString() === '0' ||
          challengeStartTime.toString() !== '0' ||
          timeSinceBondCreation <= ChallengePeriodMs
      ) {
        throw new Error('Transfer root is not confirmable')
      }

      // Verify that the data in the TheGraph matches the data passed in
      // TheGraph support is not consistent on testnet, so skip this check on testnet
      if (globalConfig.isMainnet) {
        const transferCommitted = await getTransferCommitted(this.bridge.chainSlug, this.tokenSymbol, rootHash)
        if (
          rootHash !== transferCommitted?.rootHash ||
          destinationChainId !== transferCommitted?.destinationChainId ||
          totalAmount.toString() !== transferCommitted?.totalAmount?.toString() ||
          rootCommittedAt.toString() !== transferCommitted?.rootCommittedAt
        ) {
          throw new Error(`TheGraph data does not match passed in data for rootHash ${rootHash}`)
        }
      }
    }
  }
}

export default ConfirmRootsWatcher
