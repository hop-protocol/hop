import '../moduleAlias'
import { Contract, BigNumber } from 'ethers'
import { isL1 } from 'src/utils'
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
    this.logger.log('starting L1 BondTransferRoot event watcher')
    try {
      await this.watch()
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

  async watch () {
    this.l1Bridge
      .on(this.l1Bridge.TransferRootBonded, this.handleBondTransferEvent)
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
    destChainId: string,
    totalAmount: string
  ) {
    this.logger.log('received L1 BondTransferRoot event')
    this.logger.log('transferRootHash:', transferRootHash)
    this.logger.log('totalAmount:', totalAmount.toString())
    this.logger.log('destChainId:', destChainId)

    if (isL1(destChainId)) {
      // TODO
      return
    }

    const l2Bridge = new L2Bridge(this.contracts[destChainId])
    const blockNumber = await l2Bridge.getBlockNumber()
    const recentTransferCommitEvents = await l2Bridge.getTransfersCommitedEvents(
      blockNumber - 1000,
      blockNumber
    )
    this.logger.log('recent events:', recentTransferCommitEvents)

    let found = false
    for (let i = 0; i < recentTransferCommitEvents.length; i++) {
      const { args, topics } = recentTransferCommitEvents[i]
      const commitedTransferRootHash = topics[1]
      const commitedTotalAmount = args[1]

      if (
        transferRootHash === commitedTransferRootHash &&
        totalAmount.toString() === commitedTotalAmount.toString()
      ) {
        found = true
        break
      }
    }

    if (found) {
      this.logger.log('transfer root committed')
      return
    }

    this.logger.log('transfer root not committed!')
    this.logger.log('challenging transfer root')
    this.logger.log('transferrootHash', transferRootHash)
    const tx = await this.l1Bridge.challengeTransferRootBond(
      transferRootHash,
      totalAmount
    )
    tx?.wait().then(() => {
      this.emit('challengeTransferRootBond', {
        destChainId,
        transferRootHash,
        totalAmount
      })
    })
  }

  async checkChallenge (
    sourceChainId: string,
    destChainId: string,
    transferRootHash: string,
    totalAmount: string
  ) {
    this.logger.log('sourceChainId:', sourceChainId)
    this.logger.log('destChainId:', destChainId)
    this.logger.log('transferRootHash:', transferRootHash)
    this.logger.log('totalAmount:', totalAmount)
    const transferBond = await this.l1Bridge.getTransferBond(transferRootHash)
    if (Number(transferBond.challengeStartTime.toString()) === 0) {
      this.logger.log('transferRootHash is not challenged')
      return
    }
    if (transferBond.challengeResolved) {
      this.logger.log('challenge already resolved')
      return
    }
    this.logger.log('resolving challenge')
    this.logger.log('transferRootHash:', transferRootHash)
    const tx = await this.l1Bridge.resolveChallenge(
      transferRootHash,
      totalAmount
    )
    tx?.wait().then(() => {
      this.emit('challengeResolved', {
        sourceChainId,
        destChainId,
        transferRootHash,
        totalAmount
      })
    })
  }

  handleBondTransferEvent = async (
    transferRootHash: string,
    totalAmount: BigNumber,
    meta: any
  ) => {
    try {
      this.logger.log('received TransferRootBonded event')
      this.logger.log('transferRootHash:', transferRootHash)
      this.logger.log('totalAmount:', totalAmount.toString())
      const { transactionHash } = meta
      const { from: sender, data } = await this.l1Bridge.getTransaction(
        transactionHash
      )
      const address = await this.l1Bridge.getBonderAddress()
      if (sender === address) {
        this.logger.log('transfer root bonded by self')
      }
      const {
        destinationChainId
      } = await this.l1Bridge.decodeBondTransferRootData(data)
      await this.checkTransferRoot(
        transferRootHash,
        destinationChainId,
        totalAmount.toString()
      )
    } catch (err) {
      this.logger.log('checkTransferRoot error:', err.message)
    }
  }

  handleTransferRootConfirmedEvent = async (
    sourceChainId: BigNumber,
    destChainId: BigNumber,
    transferRootHash: string,
    totalAmount: BigNumber,
    meta: any
  ) => {
    this.logger.log('received TransferRootConfirmed event')
    try {
      await this.checkChallenge(
        sourceChainId.toString(),
        destChainId.toString(),
        transferRootHash,
        totalAmount.toString()
      )
    } catch (err) {
      this.logger.log('checkChallenge error:', err.message)
    }
  }
}

export default ChallengeWatcher
