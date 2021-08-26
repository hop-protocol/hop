import '../moduleAlias'
import BaseWatcher from './classes/BaseWatcher'
import L1Bridge from './classes/L1Bridge'
import L2Bridge from './classes/L2Bridge'
import OptimismBridgeWatcher from './OptimismBridgeWatcher'
import PolygonBridgeWatcher from './PolygonBridgeWatcher'
import xDaiBridgeWatcher from './xDaiBridgeWatcher'
import { Chain, TEN_MINUTES_MS } from 'src/constants'
import { Contract } from 'ethers'

export interface Config {
  chainSlug: string
  tokenSymbol: string
  isL1: boolean
  bridgeContract: Contract
  l1BridgeContract: Contract
  label: string
  token: string
  order?: () => number
  dryMode?: boolean
}

class xDomainMessageRelayWatcher extends BaseWatcher {
  l1Bridge: L1Bridge
  lastSeen: {[key: string]: number} = {}
  xdaiWatcher: xDaiBridgeWatcher
  polygonWatcher: PolygonBridgeWatcher
  optimismWatcher: OptimismBridgeWatcher

  constructor (config: Config) {
    super({
      chainSlug: config.chainSlug,
      tokenSymbol: config.tokenSymbol,
      tag: 'xDomainMessageRelay',
      prefix: config.label,
      logColor: 'yellow',
      order: config.order,
      isL1: config.isL1,
      bridgeContract: config.bridgeContract,
      dryMode: config.dryMode
    })
    this.l1Bridge = new L1Bridge(config.l1BridgeContract)
    this.xdaiWatcher = new xDaiBridgeWatcher({
      chainSlug: Chain.Polygon,
      tokenSymbol: this.tokenSymbol,
      l1BridgeContract: config.l1BridgeContract,
      dryMode: config.dryMode
    })
    this.polygonWatcher = new PolygonBridgeWatcher({
      chainSlug: Chain.Polygon,
      tokenSymbol: this.tokenSymbol,
      dryMode: config.dryMode
    })
    this.optimismWatcher = new OptimismBridgeWatcher({
      chainSlug: Chain.Optimism,
      tokenSymbol: this.tokenSymbol,
      dryMode: config.dryMode
    })
  }

  async pollHandler () {
    await this.checkTransfersCommittedFromDb()
  }

  async checkTransfersCommittedFromDb () {
    const dbTransferRoots = await this.db.transferRoots.getUnconfirmedTransferRoots({
      sourceChainId: await this.bridge.getChainId()
    })
    if (dbTransferRoots.length) {
      this.logger.debug(
        `checking ${dbTransferRoots.length} unconfirmed transfer roots db items`
      )
    }
    for (const { transferRootHash } of dbTransferRoots) {
      // Parallelizing these calls produces RPC errors on Optimism
      await this.checkTransfersCommitted(transferRootHash)
    }
  }

  checkTransfersCommitted = async (transferRootHash: string) => {
    const dbTransferRoot = await this.db.transferRoots.getByTransferRootHash(transferRootHash)
    if (!dbTransferRoot) {
      throw new Error(`transfer root db item not found, root hash "${transferRootHash}"`)
    }

    const { destinationChainId } = dbTransferRoot

    // only process message after waiting 10 minutes
    if (!this.lastSeen[transferRootHash]) {
      this.lastSeen[transferRootHash] = Date.now()
    }

    const timestampOk = this.lastSeen[transferRootHash] + TEN_MINUTES_MS < Date.now()
    if (!timestampOk) {
      return
    }

    const logger = this.logger.create({ root: transferRootHash })
    const chainSlug = this.chainIdToSlug(await this.bridge.getChainId())
    const l2Bridge = this.bridge as L2Bridge
    const { transferRootId } = dbTransferRoot
    const isTransferRootIdConfirmed = await this.l1Bridge.isTransferRootIdConfirmed(
      destinationChainId,
      transferRootId
    )
    // TODO: run poller only after event syncing has finished
    if (isTransferRootIdConfirmed) {
      await this.db.transferRoots.update(transferRootHash, {
        confirmed: true
      })
      return
    }

    let { commitTxHash } = dbTransferRoot
    if (!commitTxHash || commitTxHash) {
      commitTxHash = await l2Bridge.getTransferRootCommittedTxHash(
        transferRootHash
      )
      if (commitTxHash) {
        this.db.transferRoots.update(transferRootHash, {
          commitTxHash
        })
      }
    }
    if (!commitTxHash) {
      this.logger.error(`commit tx hash not found for root hash ${transferRootHash}`)
      return
    }

    if (chainSlug === Chain.xDai) {
      await this.xdaiWatcher.handleCommitTxHash(commitTxHash, transferRootHash)
    } else if (chainSlug === Chain.Polygon) {
      await this.polygonWatcher.handleCommitTxHash(commitTxHash, transferRootHash)
    } else if (chainSlug === Chain.Optimism) {
      await this.optimismWatcher.handleCommitTxHash(commitTxHash, transferRootHash)
    } else if (chainSlug === Chain.Arbitrum) {
      // TODO
    } else {
      this.logger.warn(`exit watcher for ${chainSlug} is not implemented yet`)
    }
  }
}

export default xDomainMessageRelayWatcher
