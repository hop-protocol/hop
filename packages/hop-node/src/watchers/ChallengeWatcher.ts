import '../moduleAlias'
import BaseWatcherWithEventHandlers from './classes/BaseWatcherWithEventHandlers'
import L1Bridge from './classes/L1Bridge'
import L2Bridge from './classes/L2Bridge'
import chalk from 'chalk'
import { BigNumber, Contract, providers } from 'ethers'
import { Event } from 'src/types'
import { isL1ChainId } from 'src/utils'

export interface Config {
  chainSlug: string
  tokenSymbol: string
  l1BridgeContract: Contract
  label: string
  dryMode?: boolean
}

class ChallengeWatcher extends BaseWatcherWithEventHandlers {
  l1Bridge: L1Bridge

  constructor (config: Config) {
    super({
      chainSlug: config.chainSlug,
      tokenSymbol: config.tokenSymbol,
      tag: 'challengeWatcher',
      prefix: config.label,
      logColor: 'red',
      dryMode: config.dryMode
    })
    this.l1Bridge = new L1Bridge(config.l1BridgeContract)
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
      this.l1Bridge.mapTransferRootConfirmedEvents(
        async (event: Event) => {
          return this.handleRawTransferRootConfirmedEvent(event)
        },
        { cacheKey: this.cacheKey(this.l1Bridge.TransferRootConfirmed) }
      )
    )

    await Promise.all(promises)
  }

  async watch () {
    this.l1Bridge
      .on(this.l1Bridge.TransferRootBonded, this.handleTransferRootBondedEvent)
      .on(
        this.l1Bridge.TransferRootConfirmed,
        this.handleTransferRootConfirmedEvent
      )
      .on('error', err => {
        this.logger.error(`event watcher error: ${err.message}`)
        this.notifier.error(`event watcher error: ${err.message}`)
        this.quit()
      })
  }

  async pollHandler () {
    await this.checkTransferRootFromDb()
    await this.checkChallengeFromDb()
  }

  async handleRawTransferRootBondedEvent (event: Event) {
    const { root, amount } = event.args
    await this.handleTransferRootBondedEvent(root, amount, event)
  }

  async handleRawTransferRootConfirmedEvent (event: Event) {
    const {
      originChainId: sourceChainId,
      destinationChainId,
      rootHash,
      totalAmount
    } = event.args
    await this.handleTransferRootConfirmedEvent(
      sourceChainId,
      destinationChainId,
      rootHash,
      totalAmount,
      event
    )
  }

  async checkTransferRootFromDb () {
    const dbTransferRoots = await this.db.transferRoots.getChallengeableTransferRoots()
    if (dbTransferRoots.length) {
      this.logger.debug(
        `checking ${dbTransferRoots.length} challengeable transfer roots db items`
      )
    }
    for (const dbTransferRoot of dbTransferRoots) {
      const {
        transferRootHash,
        destinationChainId,
        totalAmount
      } = dbTransferRoot
      await this.checkTransferRoot(
        transferRootHash,
        destinationChainId,
        totalAmount
      )
    }
  }

  async checkChallengeFromDb () {
    const dbTransferRoots = await this.db.transferRoots.getResolvableTransferRoots()
    for (const dbTransferRoot of dbTransferRoots) {
      const {
        sourceChainId,
        destinationChainId,
        transferRootHash,
        totalAmount
      } = dbTransferRoot
      await this.checkChallenge(
        sourceChainId,
        destinationChainId,
        transferRootHash,
        totalAmount
      )
    }
  }

  async checkTransferRoot (
    transferRootHash: string,
    destinationChainId: number,
    totalAmount: BigNumber
  ) {
    const logger = this.logger.create({ root: transferRootHash })
    logger.debug('handling L1 BondTransferRoot event')
    logger.debug('transferRootHash:', transferRootHash)
    logger.debug('totalAmount:', this.bridge.formatUnits(totalAmount))
    logger.debug('destinationChainId:', destinationChainId)

    if (isL1ChainId(destinationChainId)) {
      // TODO
      return
    }

    const l2Bridge = this.getSiblingWatcherByChainId(destinationChainId)
      .bridge as L2Bridge
    const blockNumber = await l2Bridge.getBlockNumber()
    const recentTransferCommitEvents = await l2Bridge.getTransfersCommittedEvents(
      blockNumber - 1000,
      blockNumber
    )
    logger.debug('recent events:', recentTransferCommitEvents)

    let found = false
    for (let i = 0; i < recentTransferCommitEvents.length; i++) {
      const { args, topics } = recentTransferCommitEvents[i]
      const committedTransferRootHash = topics[1]
      const committedTotalAmount = args[1]

      if (
        transferRootHash === committedTransferRootHash &&
        totalAmount.eq(committedTotalAmount)
      ) {
        found = true
        break
      }
    }

    if (found) {
      logger.warn('transfer root committed')
      return
    }

    logger.debug('transfer root not committed!')
    logger.debug('challenging transfer root')
    logger.debug('transferRootHash', transferRootHash)
    if (this.dryMode) {
      this.logger.warn(
        'dry mode: skipping challengeTransferRootBond transaction'
      )
      return
    }
    const tx = await this.l1Bridge.challengeTransferRootBond(
      transferRootHash,
      totalAmount
    )
    tx?.wait()
      .then((receipt: providers.TransactionReceipt) => {
        if (receipt.status !== 1) {
          throw new Error('status=0')
        }
        this.emit('challengeTransferRootBond', {
          destinationChainId,
          transferRootHash,
          totalAmount
        })
      })
      .catch(async (err: Error) => {
        throw err
      })
    logger.debug('challenge tx:', chalk.bgYellow.black.bold(tx.hash))
  }

  async checkChallenge (
    sourceChainId: number,
    destinationChainId: number,
    transferRootHash: string,
    totalAmount: BigNumber
  ) {
    const logger = this.logger.create({ root: transferRootHash })
    logger.debug('sourceChainId:', sourceChainId)
    logger.debug('destinationChainId:', destinationChainId)
    logger.debug('transferRootHash:', transferRootHash)
    logger.debug('totalAmount:', this.bridge.formatUnits(totalAmount))
    const transferBond = await this.l1Bridge.getTransferBond(transferRootHash)
    const challengeStartTime = Number(
      transferBond.challengeStartTime.toString()
    )
    if (challengeStartTime === 0) {
      logger.warn('transferRootHash is not challenged')
      return
    }
    if (transferBond.challengeResolved) {
      logger.warn('challenge already resolved')
      return
    }
    logger.debug('resolving challenge')
    logger.debug('transferRootHash:', transferRootHash)
    const tx = await this.l1Bridge.resolveChallenge(
      transferRootHash,
      totalAmount
    )
    tx?.wait().then((receipt: providers.TransactionReceipt) => {
      if (receipt.status !== 1) {
        throw new Error('status=0')
      }
      this.emit('challengeResolved', {
        sourceChainId,
        destinationChainId,
        transferRootHash,
        totalAmount
      })
    })
  }
}

export default ChallengeWatcher
