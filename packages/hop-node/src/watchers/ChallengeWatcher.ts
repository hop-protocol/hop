import '../moduleAlias'
import BaseWatcherWithEventHandlers from './classes/BaseWatcherWithEventHandlers'
import L1Bridge from './classes/L1Bridge'
import L2Bridge from './classes/L2Bridge'
import { BigNumber, Contract } from 'ethers'
import { Event } from 'src/types'
import { Notifier } from 'src/notifier'
import { getTransferRootId } from 'src/utils'
import { hostname } from 'src/config'

export interface Config {
  chainSlug: string
  bridgeContract: Contract
  tokenSymbol: string
  label: string
  isL1: boolean
  dryMode?: boolean
}

class ChallengeWatcher extends BaseWatcherWithEventHandlers {
  siblingWatchers: { [chainId: string]: ChallengeWatcher }
  shouldSkipChallenge: { [key: string]: boolean } = {}

  constructor (config: Config) {
    super({
      chainSlug: config.chainSlug,
      tokenSymbol: config.tokenSymbol,
      tag: 'challengeWatcher',
      prefix: config.label,
      bridgeContract: config.bridgeContract,
      isL1: config.isL1,
      logColor: 'red',
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

      promises.push(
        l1Bridge.mapTransferBondChallengedEvents(
          async (event: Event) => {
            return this.handleRawTransferBondChallengedEvent(event)
          },
          { cacheKey: this.cacheKey(l1Bridge.TransferBondChallenged) }
        )
      )
    } else {
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
        .on(
          l1Bridge.TransferBondChallenged,
          this.handleTransferBondChallengedEvent
        )
        .on('error', err => {
          this.logger.error(`event watcher error: ${err.message}`)
          this.notifier.error(`event watcher error: ${err.message}`)
          this.quit()
        })
    } else {
      const l2Bridge = this.bridge as L2Bridge
      l2Bridge
        .on(l2Bridge.TransfersCommitted, this.handleTransfersCommittedEvent)
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
    if (!this.isAllSiblingWatchersInitialSyncCompleted()) {
      return
    }

    await this.checkChallengeableTransferRootFromDb()
  }

  async handleRawTransferRootBondedEvent (event: Event) {
    const {
      root,
      amount
    } = event.args
    await this.handleTransferRootBondedEvent(
      root,
      amount,
      event
    )
  }

  async handleRawTransferBondChallengedEvent (event: Event) {
    const {
      transferRootId,
      rootHash,
      originalAmount
    } = event.args
    await this.handleTransferBondChallengedEvent(
      transferRootId,
      rootHash,
      originalAmount,
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

  handleTransferBondChallengedEvent = async (
    transferRootId: string,
    rootHash: string,
    originalAmount: BigNumber,
    event: Event
  ) => {
    const logger = this.logger.create({ root: rootHash })
    const { transactionHash } = event
    const l1Bridge = this.bridge as L1Bridge
    const timestamp = await l1Bridge.getEventTimestamp(event)

    logger.debug('handling TransferBondChallenged event')
    logger.debug(`transferRootId: ${transferRootId}`)
    logger.debug(`rootHash: ${rootHash}`)
    logger.debug(`originalAmount: ${this.bridge.formatUnits(originalAmount)}`)
    logger.debug(`event transactionHash: ${transactionHash}`)
    logger.debug(`event timestamp: ${timestamp}`)

    await this.db.transferRoots.update(rootHash, {
      challenged: true,
      bondedAt: timestamp,
      bondTransferRootId: transferRootId
    })
  }

  async checkChallengeableTransferRootFromDb () {
    const dbTransferRoots = await this.db.transferRoots.getChallengeableTransferRoots()
    if (dbTransferRoots.length) {
      this.logger.debug(
        `checking ${dbTransferRoots.length} challengeable root db items`
      )
    }

    for (const dbTransferRoot of dbTransferRoots) {
      const rootHash = dbTransferRoot.transferRootHash
      if (this.shouldSkipChallenge[rootHash]) {
        return
      }

      await this.checkChallengeableTransferRoot(
        rootHash,
        dbTransferRoot.totalAmount
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

    const dbTransferRoot = await this.db.transferRoots.getByTransferRootHash(
      transferRootHash
    )

    const l1Bridge = this.bridge as L1Bridge
    const transferRootCommittedAt = await l1Bridge.getTransferRootCommittedAt(
      dbTransferRoot.destinationChainId, transferRootId
    )
    const isRootHashConfirmed = !!transferRootCommittedAt
    if (isRootHashConfirmed) {
      this.shouldSkipChallenge[transferRootHash] = true
      logger.info('rootHash is already confirmed on L1')
      return
    }

    const bond = await l1Bridge.getTransferBond(transferRootId)
    if (bond.challengeStartTime.toNumber() > 0) {
      this.shouldSkipChallenge[transferRootHash] = true
      return
    }

    const challengePeriod = await l1Bridge.getChallengePeriod()
    if (dbTransferRoot.bondedAt + challengePeriod < Date.now) {
      await this.db.transferRoots.update(transferRootHash, {
        challengeTimeExpired: true
      })

      return
    }

    const challengeMsg = `TransferRoot should be challenged! Root hash: ${transferRootHash}. Total amt: ${totalAmount}.`
    logger.debug(challengeMsg)
    await this.notifier.warn(challengeMsg)
    await this.db.transferRoots.update(transferRootHash, {
      challenged: true
    })
  }
}

export default ChallengeWatcher
