import '../moduleAlias'
import { Contract, BigNumber } from 'ethers'
import { isL1NetworkId } from 'src/utils'
import chalk from 'chalk'
//import db from 'src/db'
import BaseWatcher from './helpers/BaseWatcher'
import L1Bridge from './helpers/L1Bridge'
import L2Bridge from './helpers/L2Bridge'

export interface Config {
  l1BridgeContract: Contract
  l2BridgeContract: Contract
  label: string
  contracts: any
}

class ChallengeWatcher extends BaseWatcher {
  l1Bridge: L1Bridge
  l2Bridge: L2Bridge
  contracts: any

  constructor (config: Config) {
    super({
      tag: 'challengeWatcher',
      prefix: config.label,
      logColor: 'red'
    })
    this.l1Bridge = new L1Bridge(config.l1BridgeContract)
    this.l2Bridge = new L2Bridge(config.l2BridgeContract)
    this.contracts = config.contracts
  }

  async start () {
    this.started = true
    try {
      await Promise.all([this.syncUp(), this.watch()])
    } catch (err) {
      this.logger.error('watcher error:', err.message)
    }
  }

  async stop () {
    this.l1Bridge.removeAllListeners()
    this.l2Bridge.removeAllListeners()
    this.started = false
    this.logger.setEnabled(false)
  }

  async syncUp () {
    this.logger.debug('syncing up events')
    await this.l1Bridge.eventsBatch(async (start: number, end: number) => {
      const transferRootBondedEvents = await this.l1Bridge.getTransferRootBondedEvents(
        start,
        end
      )

      for (let event of transferRootBondedEvents) {
        const { root, amount } = event.args
        await this.handleTransferRootBondedEvent(root, amount, event)
      }

      const transferRootConfirmedEvents = await this.l1Bridge.getTransferRootConfirmedEvents(
        start,
        end
      )

      for (let event of transferRootConfirmedEvents) {
        const { root, amount } = event.args
        await this.handleTransferRootBondedEvent(root, amount, event)
      }
    })
  }

  async watch () {
    this.l1Bridge
      .on(this.l1Bridge.TransferRootBonded, this.handleTransferRootBondedEvent)
      .on('error', err => {
        this.logger.error('event watcher error:', err.message)
      })

    this.l1Bridge
      .on(
        this.l1Bridge.TransferRootConfirmed,
        this.handleTransferRootConfirmedEvent
      )
      .on('error', err => {
        this.logger.error('event watcher error:', err.message)
      })
  }

  async checkTransferRoot (
    transferRootHash: string,
    destChainId: number,
    totalAmount: BigNumber
  ) {
    this.logger.debug('received L1 BondTransferRoot event')
    this.logger.debug('transferRootHash:', transferRootHash)
    this.logger.debug('totalAmount:', this.bridge.formatUnits(totalAmount))
    this.logger.debug('destChainId:', destChainId)

    if (isL1NetworkId(destChainId)) {
      // TODO
      return
    }

    const l2Bridge = new L2Bridge(this.contracts[destChainId])
    const blockNumber = await l2Bridge.getBlockNumber()
    const recentTransferCommitEvents = await l2Bridge.getTransfersCommitedEvents(
      blockNumber - 1000,
      blockNumber
    )
    this.logger.debug('recent events:', recentTransferCommitEvents)

    let found = false
    for (let i = 0; i < recentTransferCommitEvents.length; i++) {
      const { args, topics } = recentTransferCommitEvents[i]
      const commitedTransferRootHash = topics[1]
      const commitedTotalAmount = args[1]

      if (
        transferRootHash === commitedTransferRootHash &&
        totalAmount.eq(commitedTotalAmount)
      ) {
        found = true
        break
      }
    }

    if (found) {
      this.logger.warn('transfer root committed')
      return
    }

    this.logger.debug('transfer root not committed!')
    this.logger.debug('challenging transfer root')
    this.logger.debug('transferRootHash', transferRootHash)
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
    this.logger.debug('challenge tx:', chalk.bgYellow.black.bold(tx.hash))
  }

  async checkChallenge (
    sourceChainId: number,
    destChainId: number,
    transferRootHash: string,
    totalAmount: BigNumber
  ) {
    this.logger.debug('sourceChainId:', sourceChainId)
    this.logger.debug('destChainId:', destChainId)
    this.logger.debug('transferRootHash:', transferRootHash)
    this.logger.debug('totalAmount:', this.bridge.formatUnits(totalAmount))
    const transferBond = await this.l1Bridge.getTransferBond(transferRootHash)
    const challengeStartTime = Number(
      transferBond.challengeStartTime.toString()
    )
    if (challengeStartTime === 0) {
      this.logger.warn('transferRootHash is not challenged')
      return
    }
    if (transferBond.challengeResolved) {
      this.logger.warn('challenge already resolved')
      return
    }
    this.logger.debug('resolving challenge')
    this.logger.debug('transferRootHash:', transferRootHash)
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

  handleTransferRootBondedEvent = async (
    transferRootHash: string,
    totalAmount: BigNumber,
    meta: any
  ) => {
    try {
      this.logger.debug('received TransferRootBonded event')
      this.logger.debug('transferRootHash:', transferRootHash)
      this.logger.debug('totalAmount:', this.bridge.formatUnits(totalAmount))
      const { transactionHash } = meta
      const { from: sender, data } = await this.l1Bridge.getTransaction(
        transactionHash
      )
      const address = await this.l1Bridge.getBonderAddress()
      if (sender === address) {
        this.logger.warn('transfer root bonded by self')
      }
      const {
        destinationChainId
      } = await this.l1Bridge.decodeBondTransferRootData(data)
      await this.checkTransferRoot(
        transferRootHash,
        destinationChainId,
        totalAmount
      )
    } catch (err) {
      this.logger.error('checkTransferRoot error:', err.message)
    }
  }

  handleTransferRootConfirmedEvent = async (
    sourceChainId: BigNumber,
    destChainId: BigNumber,
    transferRootHash: string,
    totalAmount: BigNumber,
    meta: any
  ) => {
    this.logger.debug('received TransferRootConfirmed event')
    try {
      await this.checkChallenge(
        Number(sourceChainId.toString()),
        Number(destChainId.toString()),
        transferRootHash,
        totalAmount
      )
    } catch (err) {
      this.logger.error('checkChallenge error:', err.message)
    }
  }
}

export default ChallengeWatcher
