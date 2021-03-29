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
      await Promise.all([this.syncUp(), this.watch(), this.pollCheck()])
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
  }

  async pollCheck () {
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

  checkTransferRoot = async () => {
    const transferRoots: TransferRoot[] = await db.transferRoots.getUnsettledBondedTransferRoots()

    for (let dbTransferRoot of transferRoots) {
      let transferHashes = Object.values(dbTransferRoot.transferHashes || [])
      const totalAmount = dbTransferRoot.totalAmount
      const chainId = dbTransferRoot.chainId
      if (!chainId) {
        continue
      }
      if (!dbTransferRoot.bonded) {
        continue
      }
      try {
        this.logger.log(
          'transferRootHash:',
          chalk.bgMagenta.black(dbTransferRoot.transferRootHash)
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

        if (transferRootHash !== dbTransferRoot.transferRootHash) {
          this.logger.log(`computed transfer root hash doesn't match`)
          return
        }

        const bridge = new Bridge(this.contracts[chainId])
        const transferBondStruct = await bridge.getTransferRoot(
          transferRootHash,
          totalAmount
        )

        const structTotalAmount = Number(
          parseUnits(transferBondStruct.total.toString(), 18)
        )
        const structAmountWithdrawn = Number(
          parseUnits(transferBondStruct.amountWithdrawn.toString(), 18)
        )
        const createdAt = Number(
          parseUnits(transferBondStruct.createdAt.toString(), 18)
        )
        this.logger.debug('struct total amount:', structTotalAmount)
        this.logger.debug('struct withdrawnAmount:', structAmountWithdrawn)
        this.logger.debug('struct createdAt:', createdAt)
        if (structTotalAmount <= 0) {
          this.logger.log('transferRoot total amount is 0. Cannot settle')
          return
        }

        let totalBondsSettleAmount = 0
        for (let transferHash of transferHashes) {
          const transferBondAmount = await bridge.getBondedWithdrawalAmount(
            transferHash
          )
          totalBondsSettleAmount += transferBondAmount
        }

        this.logger.debug('totalBondedSettleAmount:', createdAt)
        const newAmountWithdrawn =
          structAmountWithdrawn + totalBondsSettleAmount
        this.logger.debug(' newAmountWithdrawn:', newAmountWithdrawn)
        if (newAmountWithdrawn > structTotalAmount) {
          this.logger.log('withdrawal exceeds transfer root total')
          return
        }

        dbTransferRoot = await db.transferRoots.getByTransferRootHash(
          transferRootHash
        )
        if (dbTransferRoot?.sentSettleTx || dbTransferRoot?.settled) {
          this.logger.log(
            'sent?:',
            dbTransferRoot.sentSettleTx,
            'settled?:',
            dbTransferRoot.settled
          )
          return
        }

        await db.transferRoots.update(transferRootHash, {
          sentSettleTx: true
        })
        this.logger.log('sending settle tx')
        const tx = await this.settleBondedWithdrawal(
          transferHashes,
          Number(totalAmount),
          chainId
        )
        tx?.wait()
          .then(async (receipt: any) => {
            if (receipt.status !== 1) {
              await db.transferRoots.update(dbTransferRoot.transferRootHash, {
                sentSettleTx: false
              })
              throw new Error('status=0')
            }
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
          .catch(async (err: Error) => {
            await db.transferRoots.update(transferRootHash, {
              sentSettleTx: false
            })

            throw err
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
        await db.transferRoots.update(dbTransferRoot.transferRootHash, {
          sentSettleTx: false
        })
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
