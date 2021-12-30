import '../moduleAlias'
import ArbitrumBridgeWatcher from './ArbitrumBridgeWatcher'
import BaseWatcher from './classes/BaseWatcher'
import L1Bridge from './classes/L1Bridge'
import OptimismBridgeWatcher from './OptimismBridgeWatcher'
import PolygonBridgeWatcher from './PolygonBridgeWatcher'
import xDaiBridgeWatcher from './xDaiBridgeWatcher'
import { Chain } from 'src/constants'
import { L1Bridge as L1BridgeContract } from '@hop-protocol/core/contracts/L1Bridge'
import { L1ERC20Bridge as L1ERC20BridgeContract } from '@hop-protocol/core/contracts/L1ERC20Bridge'
import { L2Bridge as L2BridgeContract } from '@hop-protocol/core/contracts/L2Bridge'
import { getEnabledNetworks } from 'src/config'

type Config = {
  chainSlug: string
  tokenSymbol: string
  isL1: boolean
  bridgeContract: L1BridgeContract | L1ERC20BridgeContract | L2BridgeContract
  l1BridgeContract: L1BridgeContract | L1ERC20BridgeContract
  label: string
  token: string
  dryMode?: boolean
}

type Watcher = xDaiBridgeWatcher | PolygonBridgeWatcher | OptimismBridgeWatcher | ArbitrumBridgeWatcher

class xDomainMessageRelayWatcher extends BaseWatcher {
  l1Bridge: L1Bridge
  lastSeen: {[key: string]: number} = {}
  watchers: {[chain: string]: Watcher} = {}

  constructor (config: Config) {
    super({
      chainSlug: config.chainSlug,
      tokenSymbol: config.tokenSymbol,
      tag: 'xDomainMessageRelay',
      prefix: config.label,
      logColor: 'yellow',
      isL1: config.isL1,
      bridgeContract: config.bridgeContract,
      dryMode: config.dryMode
    })
    this.logger.debug('starting watcher')
    const enabledNetworks = getEnabledNetworks()
    this.l1Bridge = new L1Bridge(config.l1BridgeContract)
    if (this.chainSlug === Chain.xDai && enabledNetworks.includes(Chain.xDai)) {
      this.watchers[Chain.xDai] = new xDaiBridgeWatcher({
        chainSlug: config.chainSlug,
        tokenSymbol: this.tokenSymbol,
        label: config.label,
        l1BridgeContract: config.l1BridgeContract,
        bridgeContract: config.bridgeContract,
        isL1: config.isL1,
        dryMode: config.dryMode
      })
    }
    if (this.chainSlug === Chain.Polygon && enabledNetworks.includes(Chain.Polygon)) {
      this.watchers[Chain.Polygon] = new PolygonBridgeWatcher({
        chainSlug: config.chainSlug,
        tokenSymbol: this.tokenSymbol,
        label: config.label,
        bridgeContract: config.bridgeContract,
        isL1: config.isL1,
        dryMode: config.dryMode
      })
    }
    if (this.chainSlug === Chain.Optimism && enabledNetworks.includes(Chain.Optimism)) {
      this.watchers[Chain.Optimism] = new OptimismBridgeWatcher({
        chainSlug: config.chainSlug,
        tokenSymbol: this.tokenSymbol,
        label: config.label,
        bridgeContract: config.bridgeContract,
        isL1: config.isL1,
        dryMode: config.dryMode
      })
    }
    if (this.chainSlug === Chain.Arbitrum && enabledNetworks.includes(Chain.Arbitrum)) {
      this.watchers[Chain.Arbitrum] = new ArbitrumBridgeWatcher({
        chainSlug: config.chainSlug,
        tokenSymbol: this.tokenSymbol,
        label: config.label,
        bridgeContract: config.bridgeContract,
        isL1: config.isL1,
        dryMode: config.dryMode
      })
    }

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

  checkTransfersCommitted = async (transferRootId: string) => {
    const dbTransferRoot = await this.db.transferRoots.getByTransferRootId(transferRootId)
    if (!dbTransferRoot) {
      throw new Error(`transfer root db item not found, root id "${transferRootId}"`)
    }

    const { destinationChainId, commitTxHash } = dbTransferRoot

    const logger = this.logger.create({ root: transferRootId })
    const chainSlug = this.chainIdToSlug(await this.bridge.getChainId())
    const isTransferRootIdConfirmed = await this.l1Bridge.isTransferRootIdConfirmed(
      destinationChainId!,
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
    await watcher.handleCommitTxHash(commitTxHash!, transferRootId, logger)
  }
}

export default xDomainMessageRelayWatcher
