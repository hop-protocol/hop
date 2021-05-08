import '../moduleAlias'
import { Contract, BigNumber } from 'ethers'
import { parseUnits, formatUnits } from 'ethers/lib/utils'
import { wait, networkIdToSlug, isL1NetworkId } from 'src/utils'
import db from 'src/db'
import { TransferRoot } from 'src/db/TransferRootsDb'
import chalk from 'chalk'
import BaseWatcher from './helpers/BaseWatcher'
import Bridge from './helpers/Bridge'
import L1Bridge from './helpers/L1Bridge'
import L2Bridge from './helpers/L2Bridge'
import Token from './helpers/Token'
import MerkleTree from 'src/utils/MerkleTree'

export interface Config {
  isL1: boolean
  bridgeContract: Contract
  label: string
  order?: () => number
  dryMode?: boolean
}

const BONDER_ORDER_DELAY_MS = 60 * 1000

class SettleBondedWithdrawalWatcher extends BaseWatcher {
  siblingWatchers: { [chainId: string]: SettleBondedWithdrawalWatcher }
  minThresholdPercent: number = 0.5 // 50%

  constructor (config: Config) {
    super({
      tag: 'settleBondedWithdrawalWatcher',
      prefix: config.label,
      logColor: 'magenta',
      order: config.order,
      isL1: config.isL1,
      bridgeContract: config.bridgeContract,
      dryMode: config.dryMode
    })
  }

  async start () {
    this.started = true
    try {
      await Promise.all([this.syncUp(), this.watch(), this.pollCheck()])
    } catch (err) {
      this.logger.error(`watcher error:`, err.message)
      this.notifier.error(`watcher error: ${err.message}`)
    }
  }

  async stop () {
    this.bridge.removeAllListeners()
    this.started = false
    this.logger.setEnabled(false)
  }

  async syncUp () {
    if (!this.isL1) {
      return
    }
    const blockNumber = await this.bridge.getBlockNumber()
    const startBlockNumber = blockNumber - 1000
    const transferRootBondedEvents = await (this
      .bridge as L1Bridge).getTransferRootBondedEvents(
      startBlockNumber,
      blockNumber
    )

    for (let event of transferRootBondedEvents) {
      const { root, amount } = event.args
      await this.handleTransferRootBondedEvent(root, amount, event)
    }
  }

  async watch () {
    if (!this.isL1) {
      return
    }
    this.bridge
      .on(
        (this.bridge as L1Bridge).TransferRootBonded,
        this.handleTransferRootBondedEvent
      )
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
        this.notifier.error(`error checking: ${err.message}`)
      }
      await wait(10 * 1000)
    }
  }

  settleBondedWithdrawals = async (
    bonder: string,
    transferHashes: string[],
    totalAmount: BigNumber,
    chainId: number
  ) => {
    const bridge = this.siblingWatchers[chainId].bridge
    const decimals = await this.getBridgeTokenDecimals(chainId)
    return bridge.settleBondedWithdrawals(bonder, transferHashes, totalAmount)
  }

  checkTransferRoot = async () => {
    const transferRoots: TransferRoot[] = await db.transferRoots.getUnsettledBondedTransferRoots()

    for (let dbTransferRoot of transferRoots) {
      let transferHashes = Object.values(dbTransferRoot.transferHashes || [])
      const totalAmount = dbTransferRoot.totalAmount
      const chainId = dbTransferRoot.chainId
      const bonder = dbTransferRoot.bonder
      if (!chainId) {
        continue
      }
      // only process transfer roots where this bridge is the destination chain
      const bridgeChainId = await this.bridge.getNetworkId()
      if (chainId !== bridgeChainId) {
        return
      }
      if (!dbTransferRoot.bonder) {
        continue
      }
      if (!dbTransferRoot.bonded) {
        continue
      }
      try {
        const bridge = this.siblingWatchers[chainId].bridge
        await this.bridge.waitSafeConfirmations()

        this.logger.debug(
          'transferRootHash:',
          chalk.bgMagenta.black(dbTransferRoot.transferRootHash)
        )
        if (!transferHashes.length) {
          this.logger.warn('no transfer hashes to settle')
          return
        }
        const tree = new MerkleTree(transferHashes)
        const transferRootHash = tree.getHexRoot()
        this.logger.debug('chainId:', chainId)
        this.logger.debug('transferHashes:', transferHashes)
        this.logger.debug('transferRootHash:', transferRootHash)
        this.logger.debug('totalAmount:', this.bridge.formatUnits(totalAmount))

        if (transferRootHash !== dbTransferRoot.transferRootHash) {
          this.logger.warn(`computed transfer root hash doesn't match`)
          return
        }

        const transferBondStruct = await bridge.getTransferRoot(
          transferRootHash,
          totalAmount
        )

        const structTotalAmount = transferBondStruct.total
        const structAmountWithdrawn = transferBondStruct.amountWithdrawn
        const createdAt = Number(transferBondStruct.createdAt.toString())
        this.logger.debug(
          'struct total amount:',
          this.bridge.formatUnits(structTotalAmount)
        )
        this.logger.debug(
          'struct withdrawnAmount:',
          this.bridge.formatUnits(structAmountWithdrawn)
        )
        this.logger.debug('struct createdAt:', createdAt)
        if (structTotalAmount.lte(0)) {
          this.logger.warn('transferRoot total amount is 0. Cannot settle')
          return
        }

        let totalBondsSettleAmount = BigNumber.from(0)
        for (let transferHash of transferHashes) {
          const transferBondAmount = await bridge.getBondedWithdrawalAmountByBonder(
            bonder,
            transferHash
          )
          totalBondsSettleAmount = totalBondsSettleAmount.add(
            transferBondAmount
          )
        }

        let [credit, debit, bondedBondedWithdrawalsBalance] = await Promise.all(
          [
            bridge.getCredit(),
            bridge.getDebit(),
            bridge.getBonderBondedWithdrawalsBalance()
          ]
        )
        const bonderDestBridgeStakedAmount = credit
          .sub(debit)
          .add(bondedBondedWithdrawalsBalance)
        if (
          totalBondsSettleAmount
            .div(bonderDestBridgeStakedAmount)
            .lt(BigNumber.from(this.minThresholdPercent))
        ) {
          this.logger.warn(
            `total bonded withdrawal amount ${this.bridge.formatUnits(
              totalBondsSettleAmount
            )} does not meet min threshold of ${this.minThresholdPercent *
              100}% of total staked ${this.bridge.formatUnits(
              bonderDestBridgeStakedAmount
            )}. Cannot settle yet`
          )
          return
        }

        this.logger.debug('totalBondedSettleAmount:', createdAt)
        const newAmountWithdrawn = structAmountWithdrawn.add(
          totalBondsSettleAmount
        )
        this.logger.debug(
          'newAmountWithdrawn:',
          this.bridge.formatUnits(newAmountWithdrawn)
        )
        if (newAmountWithdrawn.gt(structTotalAmount)) {
          this.logger.warn('withdrawal exceeds transfer root total')
          return
        }

        dbTransferRoot = await db.transferRoots.getByTransferRootHash(
          transferRootHash
        )
        if (dbTransferRoot?.sentSettleTx || dbTransferRoot?.settled) {
          this.logger.debug(
            'sent?:',
            !!dbTransferRoot.sentSettleTx,
            'settled?:',
            !!dbTransferRoot.settled
          )
          return
        }

        if (this.dryMode) {
          this.logger.warn(
            'dry mode: skipping settleBondedWithdrawals transaction'
          )
          return
        }

        await db.transferRoots.update(transferRootHash, {
          sentSettleTx: true
        })
        this.logger.debug('sending settle tx')
        const tx = await this.settleBondedWithdrawals(
          bonder,
          transferHashes,
          totalAmount,
          chainId
        )
        this.logger.info(`settle tx:`, chalk.bgYellow.black.bold(tx.hash))
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
        this.logger.info(
          `settleBondedWithdrawal on chainId:${chainId} tx: ${chalk.bgYellow.black.bold(
            tx.hash
          )}`
        )
        this.notifier.info(
          `settleBondedWithdrawal on chainId:${chainId} tx: ${tx.hash}`
        )
      } catch (err) {
        if (err.message !== 'cancelled') {
          this.logger.error(`settleBondedWithdrawal error:`, err.message)
          this.notifier.error(`settleBondedWithdrawal error: ${err.message}`)
        }
        await db.transferRoots.update(dbTransferRoot.transferRootHash, {
          sentSettleTx: false
        })
      }
    }
  }

  handleTransferRootBondedEvent = async (
    transferRootHash: string,
    totalAmount: BigNumber,
    meta: any
  ) => {
    const dbTransferRoot = await db.transferRoots.getByTransferRootHash(
      transferRootHash
    )
    if (dbTransferRoot?.bonded) {
      return
    }
    const { transactionHash } = meta
    const tx = await meta.getTransaction()
    const { from: bonder } = tx
    const decimals = await this.getBridgeTokenDecimals(
      this.bridge.providerNetworkId
    )
    this.logger.debug(`received L1 BondTransferRoot event:`)
    this.logger.debug(`transferRootHash from event: ${transferRootHash}`)
    this.logger.debug(`bondAmount: ${this.bridge.formatUnits(totalAmount)}`)
    this.logger.debug(`event transactionHash: ${transactionHash}`)
    await db.transferRoots.update(transferRootHash, {
      committed: true,
      bonded: true,
      bonder
    })
  }

  async getBridgeTokenDecimals (chainId: number) {
    let bridge: any
    let token: Token
    if (isL1NetworkId(chainId)) {
      bridge = this.siblingWatchers[chainId].bridge as L1Bridge
      token = await bridge.l1CanonicalToken()
    } else {
      bridge = this.siblingWatchers[chainId].bridge as L2Bridge
      token = await bridge.hToken()
    }
    return token.decimals()
  }

  async waitTimeout (transferHash: string, chainId: number) {
    await wait(2 * 1000)
    if (!this.order()) {
      return
    }
    this.logger.debug(
      `waiting for settle bonded withdrawal event. transferHash: ${transferHash} chainId: ${chainId}`
    )
    const bridge = this.siblingWatchers[chainId].bridge
    let timeout = this.order() * BONDER_ORDER_DELAY_MS
    while (timeout > 0) {
      if (!this.started) {
        return
      }

      // TODO
      break

      const delay = 2 * 1000
      timeout -= delay
      await wait(delay)
    }
    if (timeout <= 0) {
      return
    }
    this.logger.debug(`transfer hash already bonded ${transferHash}`)
    throw new Error('cancelled')
  }
}

export default SettleBondedWithdrawalWatcher
