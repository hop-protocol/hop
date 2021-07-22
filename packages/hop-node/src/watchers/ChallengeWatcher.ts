import '../moduleAlias'
import BaseWatcherWithEventHandlers from './classes/BaseWatcherWithEventHandlers'
import L1Bridge from './classes/L1Bridge'
import L2Bridge from './classes/L2Bridge'
import db from 'src/db'
import { BigNumber, Contract } from 'ethers'
import chalk from 'chalk'
import { Event } from 'src/types'
import { Notifier } from 'src/notifier'
import { getTransferRootId } from 'src/utils'
import { hostname } from 'src/config'

export interface Config {
  chainSlug: string
  isL1: boolean
  bridgeContract: Contract
  tokenSymbol: string
  label: string
  dryMode?: boolean
}

class ChallengeWatcher extends BaseWatcherWithEventHandlers {
  constructor (config: Config) {
    super({
      chainSlug: config.chainSlug,
      tokenSymbol: config.tokenSymbol,
      tag: 'challengeWatcher',
      prefix: config.label,
      logColor: 'red',
      isL1: config.isL1,
      bridgeContract: config.bridgeContract,
      dryMode: config.dryMode
    })
    this.notifier = new Notifier(`watcher: ChallengeWatcher, host: ${hostname}`)
  }

  async syncHandler (): Promise<any> {
    const promises: Promise<any>[] = []
    if (this.isL1) {
      const l1Bridge = this.bridge as L1Bridge
      promises.push(
        l1Bridge.mapTransferRootBondedEvents(
          async (event: Event) => {
            return this.handleRawTransferRootBondedEvent(event)
          },
          { cacheKey: this.cacheKey(l1Bridge.TransferRootBonded) }
        )
      )
    }
    if (!this.isL1) {
      const l2Bridge = this.bridge as L2Bridge
      promises.push(
        l2Bridge.mapTransfersCommittedEvents(
          async (event: Event) => {
            return this.handleRawTransfersCommittedEvent(event)
          },
          { cacheKey: this.cacheKey(l2Bridge.TransfersCommitted) }
        )
      )
    }

    await Promise.all(promises)
  }

  async watch () {
    if (this.isL1) {
      const l1Bridge = this.bridge as L1Bridge
      l1Bridge
        .on(
          l1Bridge.TransferRootBonded,
          this.handleTransferRootBondedEvent
        )
        .on('error', err => {
          this.logger.error(`event watcher error: ${err.message}`)
          this.notifier.error(`event watcher error: ${err.message}`)
          this.quit()
        })
    } else {
      const l2Bridge = this.bridge as L2Bridge
      l2Bridge
        .on(
          l2Bridge.TransfersCommitted,
          this.handleTransfersCommittedEvent
        )
        .on('error', err => {
          this.logger.error(`event watcher error: ${err.message}`)
          this.notifier.error(`event watcher error: ${err.message}`)
          this.quit()
        })
    }
  }

  async pollHandler () {
    if (!this.isL1) {
      return
    }
    await this.checkChallengeableTransferRootFromDb()
  }

  async handleRawTransferRootBondedEvent (event: Event) {
    const {
      transferRootHash,
      totalAmount
    } = event.args
    await this.handleTransferRootBondedEvent(
      transferRootHash,
      totalAmount,
      event
    )
  }

  async handleRawTransfersCommittedEvent (event: Event) {
    const {
      destinationChainId,
      rootHash,
      totalAmount,
      rootCommittedAt
    } = event.args
    await this.handleTransfersCommittedEvent(
      destinationChainId,
      rootHash,
      totalAmount,
      rootCommittedAt,
      event
    )
  }

  async checkChallengeableTransferRootFromDb () {
    const initialSyncCompleted = this.isAllSiblingWatchersInitialSyncCompleted()
    if (!initialSyncCompleted) {
      return false
    }

    const dbTransferRoots = await this.db.transferRoots.getChallengeableTransferRoots()
    if (dbTransferRoots.length) {
      this.logger.debug(
        `checking ${dbTransferRoots.length} challengeable root db items`
      )
    }
  }

  async checkChallengeableTransferRoot (
    transferRootHash: string,
    totalAmount: BigNumber
  ) {
    const logger = this.logger.create({ root: transferRootHash })
    const transferRootId = getTransferRootId(transferRootHash, totalAmount)

    logger.debug('Challenging transfer root', transferRootHash)
    logger.debug('transferRootHash:', transferRootHash)
    logger.debug('totalAmount:', this.bridge.formatUnits(totalAmount))
    logger.debug('transferRootId:', transferRootId)

    const l1Bridge = this.bridge as L1Bridge
    const currentChainId: number = await this.bridge.getChainId()
    const activeChainIds: number[] = await this.bridge.getChainIds()
    let isRootHashCommitted: boolean
    let rootHashCommittedChainId: number
    for (const chainId of activeChainIds) {
      if (currentChainId === chainId) {
        continue
      }

      const dbTransferRoot = await db.transferRoots.getByTransferRootHash(
        transferRootHash
      )
      const isRootHashCommitted = dbTransferRoot?.committed
      if (isRootHashCommitted) {
        rootHashCommittedChainId = chainId
      }
    }

    if (isRootHashCommitted) {
      logger.info(`rootHash has a valid commit on the destination chain ${rootHashCommittedChainId}`)
      return
    }

    const transferRootCommittedAt = await l1Bridge.getTransferRootCommittedAt(transferRootId)
    const isRootHashConfirmed = !!transferRootCommittedAt
    if (isRootHashConfirmed) {
      logger.info('rootHash is already confirmed on L1')
      return
    }

    const challengeMsg = `TransferRoot should be challenged! Root hash: ${transferRootHash}. Total amt: ${totalAmount}.`
    logger.debug(challengeMsg)
    await this.notifier.warn(challengeMsg)
  }
}

export default ChallengeWatcher
