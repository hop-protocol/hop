import '../moduleAlias'
import { Contract, BigNumber, Event } from 'ethers'
import { wait, isL1ChainId } from 'src/utils'
import db from 'src/db'
import chalk from 'chalk'
import BaseWatcherWithEventHandlers from './classes/BaseWatcherWithEventHandlers'
import L1Bridge from './classes/L1Bridge'
import L2Bridge from './classes/L2Bridge'

export interface Config {
  l1BridgeContract: Contract
  l2BridgeContract: Contract
  label: string
  contracts: any
}

class ChallengeWatcher extends BaseWatcherWithEventHandlers {
  l1Bridge: L1Bridge
  contracts: any

  constructor (config: Config) {
    super({
      tag: 'challengeWatcher',
      prefix: config.label,
      logColor: 'red'
    })
    this.l1Bridge = new L1Bridge(config.l1BridgeContract)
    this.contracts = config.contracts
  }

  async start () {
    this.started = true
    try {
      await Promise.all([this.syncUp(), this.watch(), this.pollCheck()])
    } catch (err) {
      this.logger.error('watcher error:', err.message)
    }
  }

  async syncUp (): Promise<any> {
    this.logger.debug('syncing up events')

    const promises: Promise<any>[] = []
    promises.push(
      this.l1Bridge.eventsBatch(
        async (start: number, end: number) => {
          const events = await this.l1Bridge.getTransferRootBondedEvents(start, end)
          await this.handleTransferRootBondedEvents(events)
        },
        { key: this.l1Bridge.TransferRootBonded }
      )
    )

    promises.push(
      this.l1Bridge.eventsBatch(
        async (start: number, end: number) => {
          const events = await this.l1Bridge.getTransferRootConfirmedEvents(start, end)
          await this.handleTransferRootConfirmedEvents(events)
        },
        { key: this.l1Bridge.TransferRootConfirmed }
      )
    )

    await Promise.all(promises)
    this.logger.debug('done syncing')

    // re-sync every 6 hours
    const sixHours = this.syncTimeSec
    await wait(sixHours)
    return this.syncUp()
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

  async pollCheck () {
    while (true) {
      if (!this.started) {
        return
      }
      try {
        await this.checkTransferRootFromDb()
        await this.checkChallengeFromDb()
      } catch (err) {
        this.logger.error(`poll check error: ${err.message}`)
        this.notifier.error(`poll check error: ${err.message}`)
      }
      await wait(this.pollTimeSec)
    }
  }

  async handleTransferRootBondedEvents (events: Event[]) {
    for (let event of events) {
      const { root, amount } = event.args
      await this.handleTransferRootBondedEvent(
        root,
        amount,
        event
      )
    }
  }

  async handleTransferRootConfirmedEvents (events: Event[]) {
    for (let event of events) {
      const {
        originChainId,
        destinationChainId, 
        rootHash,
        totalAmount
      } = event.args
      await this.handleTransferRootConfirmedEvent(
        originChainId,
        destinationChainId,
        rootHash,
        totalAmount,
        event
      )
    }
  }

  async checkTransferRootFromDb () {
    const dbTransferRoots = await db.transferRoots.getChallengeableTransferRoots()
    for (let dbTransferRoot of dbTransferRoots) {
      const {
        transferRootHash,
        chainId,
        totalAmount
      } = dbTransferRoot
      await this.checkTransferRoot(
        transferRootHash,
        chainId,
        totalAmount
      )
    }
  }

  async checkChallengeFromDb () {
    const dbTransferRoots = await db.transferRoots.getResolvableTransferRoots()
    for (let dbTransferRoot of dbTransferRoots) {
      const {
        sourceChainId,
        chainId,
        transferRootHash,
        totalAmount
      } = dbTransferRoot
      await this.checkChallenge(
        sourceChainId,
        chainId,
        transferRootHash,
        totalAmount
      )
    }
  }

  async checkTransferRoot (
    transferRootHash: string,
    destChainId: number,
    totalAmount: BigNumber
  ) {
    const logger = this.logger.create({ root: transferRootHash })
    logger.debug('received L1 BondTransferRoot event')
    logger.debug('transferRootHash:', transferRootHash)
    logger.debug('totalAmount:', this.bridge.formatUnits(totalAmount))
    logger.debug('destChainId:', destChainId)

    if (isL1ChainId(destChainId)) {
      // TODO
      return
    }

    const l2Bridge = new L2Bridge(this.contracts[destChainId])
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
    const tx = await this.l1Bridge.challengeTransferRootBond(
      transferRootHash,
      totalAmount
    )
    tx?.wait()
      .then((receipt: any) => {
        if (receipt.status !== 1) {
          throw new Error('status=0')
        }
        this.emit('challengeTransferRootBond', {
          destChainId,
          transferRootHash,
          totalAmount
        })
      })
      .catch(async (err: Error) => {
        /*
      db.transferRoots.update(transferRootHash, {
      })
      */

        throw err
      })
    logger.debug('challenge tx:', chalk.bgYellow.black.bold(tx.hash))
  }

  async checkChallenge (
    sourceChainId: number,
    destChainId: number,
    transferRootHash: string,
    totalAmount: BigNumber
  ) {
    const logger = this.logger.create({ root: transferRootHash })
    logger.debug('sourceChainId:', sourceChainId)
    logger.debug('destChainId:', destChainId)
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
    tx?.wait().then((receipt: any) => {
      if (receipt.status !== 1) {
        throw new Error('status=0')
      }
      this.emit('challengeResolved', {
        sourceChainId,
        destChainId,
        transferRootHash,
        totalAmount
      })
    })
  }
}

export default ChallengeWatcher
