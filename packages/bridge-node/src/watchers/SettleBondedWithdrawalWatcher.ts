import '../moduleAlias'
import { Contract } from 'ethers'
import { parseUnits, formatUnits } from 'ethers/lib/utils'
import { wait, networkIdToSlug } from 'src/utils'
import db from 'src/db'
import { TransferRoot } from 'src/db/TransferRootsDb'
import chalk from 'chalk'
import BaseWatcher from './base/BaseWatcher'
import L1Bridge from './base/L1Bridge'
import L2Bridge from './base/L2Bridge'
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
      await this.watch()
    } catch (err) {
      this.emit('error', err)
      this.logger.error(`watcher error:`, err)
    }
  }

  async stop () {
    this.l1Bridge.removeAllListeners()
    this.l2Bridge.removeAllListeners()
    this.started = false
    this.logger.setEnabled(false)
  }

  settleBondedWithdrawal = async (
    transferHashes: string[],
    totalAmount: number,
    chainId: string
  ) => {
    const bridge = this.contracts[chainId]
    const bonder = await this.l1Bridge.getBonderAddress()
    const parsedAmount = parseUnits(totalAmount.toString(), 18)
    return bridge.settleBondedWithdrawals(
      bonder,
      transferHashes,
      parsedAmount,
      {
        //gasLimit: 1000000
      }
    )
  }

  getBondedAmount = async (transferHash: string, chainId: string) => {
    const bridge = this.contracts[chainId]
    const bonder = await this.l1Bridge.getBonderAddress()
    const bondedBn = await bridge.getBondedWithdrawalAmount(
      bonder,
      transferHash
    )
    const bondedAmount = Number(formatUnits(bondedBn.toString(), 18))
    return bondedAmount
  }

  check = async () => {
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
          this.emit('error', err)
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

  async watch () {
    this.l1Bridge
      .on(this.l1Bridge.TransferRootBonded, this.handleTransferRootBondedEvent)
      .on('error', err => {
        this.emit('error', err)
        this.logger.error(`event watcher error:`, err.message)
      })

    while (true) {
      try {
        if (!this.started) {
          return
        }
        await this.check()
      } catch (err) {
        this.logger.error('error checking:', err.message)
      }
      await wait(10 * 1000)
    }
  }
}

export default SettleBondedWithdrawalWatcher
