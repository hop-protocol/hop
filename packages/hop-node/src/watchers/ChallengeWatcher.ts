import '../moduleAlias'
import BaseWatcherWithEventHandlers from './classes/BaseWatcherWithEventHandlers'
import L1Bridge from './classes/L1Bridge'
import { BigNumber, Contract } from 'ethers'
import { Event } from 'src/types'
import { Notifier } from 'src/notifier'
import { getTransferRootId } from 'src/utils'
import { hostname } from 'src/config'

export interface Config {
  chainSlug: string
  l1BridgeContract: Contract
  tokenSymbol: string
  label: string
  dryMode?: boolean
}

class ChallengeWatcher extends BaseWatcherWithEventHandlers {
  l1Bridge: L1Bridge
  shouldSkipChallenge: { [key: string]: boolean } = {}

  constructor (config: Config) {
    super({
      chainSlug: config.chainSlug,
      tokenSymbol: config.tokenSymbol,
      tag: 'challengeWatcher',
      prefix: config.label,
      bridgeContract: config.l1BridgeContract,
      isL1: true,
      logColor: 'red',
      dryMode: config.dryMode
    })

    this.l1Bridge = this.bridge as L1Bridge
    this.notifier = new Notifier(`watcher: ChallengeWatcher, host: ${hostname}`)
  }

  async syncHandler (): Promise<any> {
    const promises: Promise<any>[] = []
    promises.push(
      this.l1Bridge.mapTransferRootBondedEvents(
        async (event: Event) => {
          return this.handleRawTransferRootBondedEvent(event)
        },
        { cacheKey: this.cacheKey(this.l1Bridge.TransferRootBonded) }
      )
    )

    promises.push(
      this.l1Bridge.mapTransferBondChallengedEvents(
        async (event: Event) => {
          return this.handleRawTransferBondChallengedEvent(event)
        },
        { cacheKey: this.cacheKey(this.l1Bridge.TransferBondChallenged) }
      )
    )

    await Promise.all(promises)
  }

  async watch () {
    this.l1Bridge
      .on(
        this.l1Bridge.TransferRootBonded,
        this.handleTransferRootBondedEvent
      )
      .on(
        this.l1Bridge.TransferBondChallenged,
        this.handleTransferBondChallengedEvent
      )
      .on('error', err => {
        this.logger.error(`event watcher error: ${err.message}`)
        this.notifier.error(`event watcher error: ${err.message}`)
        this.quit()
      })
  }

  async pollHandler () {
    if (!this.isInitialSyncCompleted()) {
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

  handleTransferBondChallengedEvent = async (
    transferRootId: string,
    rootHash: string,
    originalAmount: BigNumber,
    event: Event
  ) => {
    const logger = this.logger.create({ root: rootHash })
    const { transactionHash } = event

    logger.debug('handling TransferBondChallenged event')
    logger.debug(`transferRootId: ${transferRootId}`)
    logger.debug(`rootHash: ${rootHash}`)
    logger.debug(`originalAmount: ${this.bridge.formatUnits(originalAmount)}`)
    logger.debug(`event transactionHash: ${transactionHash}`)

    await this.db.transferRoots.update(rootHash, {
      challenged: true
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

    const currentChainId: number = await this.bridge.getChainId()
    const activeChainIds: number[] = await this.bridge.getChainIds()
    let isRootHashCommitted: boolean
    let sourceChainId: number
    for (const chainId of activeChainIds) {
      if (currentChainId === chainId) {
        continue
      }

      const isRootHashCommitted = dbTransferRoot?.committed
      if (isRootHashCommitted) {
        sourceChainId = chainId
      }
    }

    if (isRootHashCommitted) {
      logger.info(`rootHash has a valid commit on the source chainId ${sourceChainId}`)
      this.shouldSkipChallenge[transferRootHash] = true
      return
    }

    const transferRootCommittedAt = await this.l1Bridge.getTransferRootCommittedAt(
      dbTransferRoot.destinationChainId, transferRootId
    )
    const isRootHashConfirmed = !!transferRootCommittedAt
    if (isRootHashConfirmed) {
      this.shouldSkipChallenge[transferRootHash] = true
      logger.info('rootHash is already confirmed on L1')
      return
    }

    const bond = await this.l1Bridge.getTransferBond(transferRootId)
    if (bond.challengeStartTime.toNumber() > 0) {
      this.shouldSkipChallenge[transferRootHash] = true
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
