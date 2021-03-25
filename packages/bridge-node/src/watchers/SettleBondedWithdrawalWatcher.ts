import '../moduleAlias'
import { Contract } from 'ethers'
import { parseUnits, formatUnits } from 'ethers/lib/utils'
import { wait, networkIdToSlug } from 'src/utils'
import db from 'src/db'
import { TransferRoot } from 'src/db/TransferRootsDb'
import chalk from 'chalk'
import BaseWatcher from './helpers/BaseWatcher'
import Bridge from './helpers/Bridge'
import L1Bridge from './helpers/L1Bridge'
import L2Bridge from './helpers/L2Bridge'
import MerkleTree from 'src/utils/MerkleTree'

export interface Config {
  l1BridgeContract: Contract
  l2BridgeContract: Contract
  contracts: { [networkId: string]: Contract }
  label: string
  order?: () => number
}

class SettleBondedWithdrawalWatcher extends BaseWatcher {
  l1Bridge: L1Bridge
  l2Bridge: L2Bridge
  contracts: { [networkId: string]: Contract }

  constructor (config: Config) {
    super({
      tag: 'settleBondedWithdrawalWatcher',
      prefix: config.label,
      logColor: 'magenta',
      order: config.order
    })
    this.l1Bridge = new L1Bridge(config.l1BridgeContract)
    this.l2Bridge = new L2Bridge(config.l2BridgeContract)
    this.contracts = config.contracts
  }

  async start () {
    this.started = true
    this.logger.log(`starting L1 BondTransferRoot event watcher`)
    try {
      await Promise.all([this.syncUp(), this.watch()])
    } catch (err) {
      this.logger.error(`watcher error:`, err.message)
    }
  }

  async stop () {
    this.l1Bridge.removeAllListeners()
    this.l2Bridge.removeAllListeners()
    this.started = false
    this.logger.setEnabled(false)
  }

  async syncUp () {
    const blockNumber = await this.l1Bridge.getBlockNumber()
    const startBlockNumber = blockNumber - 1000
    const transferRootBondedEvents = await this.l1Bridge.getTransferRootBondedEvents(
      startBlockNumber,
      blockNumber
    )

    for (let event of transferRootBondedEvents) {
      const { root, amount } = event.args
      await this.handleTransferRootBondedEvent(root, amount, event)
    }
  }

  async watch () {
    this.l1Bridge
      .on(this.l1Bridge.TransferRootBonded, this.handleTransferRootBondedEvent)
      .on('error', err => {
        this.logger.error(`event watcher error:`, err.message)
      })

    while (true) {
      try {
        if (!this.started) {
          return
        }
        await this.checkTransferRoot()
      } catch (err) {
        this.logger.error('error checking:', err.message)
      }
      await wait(10 * 1000)
    }
  }

  settleBondedWithdrawal = async (
    transferHashes: string[],
    totalAmount: number,
    chainId: string
  ) => {
    const bridge = new Bridge(this.contracts[chainId])
    const bonder = await this.l1Bridge.getBonderAddress()
    const parsedAmount = parseUnits(totalAmount.toString(), 18).toString()
    return bridge.settleBondedWithdrawals(bonder, transferHashes, parsedAmount)
  }

  getBondedAmount = async (transferHash: string, chainId: string) => {
    const bridge = new Bridge(this.contracts[chainId])
    return bridge.getBondedAmount(transferHash)
  }

  checkTransferRoot = async () => {
    const transferRoots: TransferRoot[] = await db.transferRoots.getUnsettledBondedTransferRoots()

    for (let transferRoot of transferRoots) {
      let transferHashes = Object.values(transferRoot.transferHashes || [])
      const totalAmount = transferRoot.totalAmount
      const chainId = transferRoot.chainId
      try {
        this.logger.log(
          'transferRootHash:',
          chalk.bgMagenta.black(transferRoot.transferRootHash)
        )
        if (!transferHashes.length) {
          this.logger.log('no transfer hashes to settle')
          return
        }
        const tree = new MerkleTree(transferHashes)
        const transferRootHash = tree.getHexRoot()
        this.logger.log('chainId:', chainId)
        this.logger.log('transferHashes:', transferHashes)
        this.logger.log('transferRootHash:', transferRootHash)
        this.logger.log('totalAmount:', totalAmount)

        const t: TransferRoot = await db.transferRoots.getByTransferRootHash(
          transferRootHash
        )
        if (t?.sentSettleTx || t?.settled) {
          this.logger.log('sent?:', t.sentSettleTx, 'settled?:', t.settled)
          return
        }

        await db.transferRoots.update(transferRootHash, {
          sentSettleTx: true
        })

        this.logger.log('sending')
        const tx = await this.settleBondedWithdrawal(
          transferHashes,
          Number(totalAmount),
          chainId
        )
        tx?.wait().then(async () => {
          await db.transferRoots.update(transferRootHash, {
            settled: true
          })
          for (let transferHash of transferHashes) {
            this.emit('settleBondedWithdrawal', {
              transferRootHash,
              networkName: networkIdToSlug(chainId),
              networkId: chainId,
              transferHash
            })

            db.transfers.update(transferHash, { withdrawalBondSettled: true })
          }
        })
        this.logger.log(
          `settleBondedWithdrawal on chain ${chainId} tx: ${chalk.bgYellow.black.bold(
            tx.hash
          )}`
        )
      } catch (err) {
        if (err.message !== 'cancelled') {
          this.logger.error(`settleBondedWithdrawal tx error:`, err.message)
        }
      }
    }
  }

  handleTransferRootBondedEvent = async (
    transferRootHash: string,
    _totalAmount: string,
    meta: any
  ) => {
    const dbTransferRoot = await db.transferRoots.getByTransferRootHash(
      transferRootHash
    )
    if (dbTransferRoot?.bonded) {
      return
    }

    const { transactionHash } = meta
    const totalAmount = Number(formatUnits(_totalAmount, 18))
    this.logger.log(`received L1 BondTransferRoot event:`)
    this.logger.log(`transferRootHash from event: ${transferRootHash}`)
    this.logger.log(`bondAmount: ${totalAmount}`)
    this.logger.log(`event transactionHash: ${transactionHash}`)
    await db.transferRoots.update(transferRootHash, {
      committed: true,
      bonded: true
    })
  }
}

export default SettleBondedWithdrawalWatcher
