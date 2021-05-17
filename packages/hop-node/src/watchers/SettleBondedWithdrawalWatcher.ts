import '../moduleAlias'
import { Contract, BigNumber } from 'ethers'
import { parseUnits, formatUnits } from 'ethers/lib/utils'
import { wait, networkIdToSlug, isL1NetworkId } from 'src/utils'
import db from 'src/db'
import { TransferRoot } from 'src/db/TransferRootsDb'
import { Transfer } from 'src/db/TransfersDb'
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
  minThresholdPercent: number
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
    if (config.minThresholdPercent) {
      this.minThresholdPercent = config.minThresholdPercent
      if (this.minThresholdPercent > 1 || this.minThresholdPercent < 0) {
        throw new Error('minThresholdAmount must be between 0 and 1')
      }
    }
  }

  async start () {
    this.started = true
    try {
      this.logger.debug(
        `minThresholdAmount: ${this.minThresholdPercent * 100}%`
      )
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
    this.logger.debug('syncing up events')
    await this.eventsBatch(async (start: number, end: number) => {
      const transferRootSetEvents = await this.bridge.getTransferRootSetEvents(
        start,
        end
      )

      for (let event of transferRootSetEvents) {
        const { rootHash, totalAmount } = event.args
        await this.handleTransferRootSetEvent(rootHash, totalAmount, event)
      }
    })
    this.logger.debug('done syncing')
  }

  async watch () {
    this.bridge
      .on(this.bridge.TransferRootSet, this.handleTransferRootSetEvent)
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
        await this.checkUnsettledTransfers()
      } catch (err) {
        this.logger.error('error checking:', err.message)
        this.notifier.error(`error checking: ${err.message}`)
      }
      await wait(10 * 1000)
    }
  }

  handleTransferRootSetEvent = async (
    transferRootHash: string,
    totalAmount: BigNumber,
    meta: any
  ) => {
    const dbTransferRoot = await db.transferRoots.getByTransferRootHash(
      transferRootHash
    )
    if (dbTransferRoot?.commited) {
      return
    }
    const { transactionHash } = meta
    const tx = await meta.getTransaction()
    const decimals = await this.getBridgeTokenDecimals(
      this.bridge.providerNetworkId
    )
    this.logger.debug(`received L1 BondTransferSet event:`)
    this.logger.debug(`transferRootHash from event: ${transferRootHash}`)
    this.logger.debug(`bondAmount: ${this.bridge.formatUnits(totalAmount)}`)
    this.logger.debug(`event transactionHash: ${transactionHash}`)
    await db.transferRoots.update(transferRootHash, {
      commited: true
    })
    if (!dbTransferRoot.transferHashes?.length) {
      this.logger.warn(
        `no db transfers found for transfer root ${transferRootHash}`
      )
      return
    }
    for (let dbTransferHash of dbTransferRoot.transferHashes) {
      const dbTransfer = await db.transfers.getByTransferHash(dbTransferHash)
      if (!dbTransfer) {
        this.logger.warn(
          `no db transfer found for transfer hash ${dbTransferHash}`
        )
      }
      if (dbTransfer?.transferRootHash) {
        continue
      }
      await db.transfers.update(dbTransferHash, {
        transferRootHash
      })
      this.logger.debug(
        `updated db transfer hash ${dbTransferHash} to have transfer root hash ${transferRootHash}`
      )
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

  checkUnsettledTransfers = async () => {
    const transfers: Transfer[] = await db.transfers.getUnsettledBondedWithdrawalTransfers()
    for (let transfer of transfers) {
      try {
        await this.checkUnsettledTransfer(transfer)
      } catch (err) {
        this.logger.error(`checkUnsettledTransfer error:`, err.message)
      }
    }
  }

  checkUnsettledTransfer = async (dbTransfer: Transfer) => {
    if (!dbTransfer) {
      this.logger.warn('db transfer item not found')
      return
    }
    const dbTransferRoot = await db.transferRoots.getByTransferRootHash(
      dbTransfer.transferRootHash
    )
    if (!dbTransferRoot) {
      return
    }
    const chainId = dbTransfer.chainId
    // only process transfer where this bridge is the destination chain
    const bridgeChainId = await this.bridge.getNetworkId()
    if (chainId !== bridgeChainId) {
      return
    }
    const bridgeAddress = await this.bridge.getAddress()
    if (
      dbTransferRoot.destinationBridgeAddress &&
      dbTransferRoot.destinationBridgeAddress !== bridgeAddress
    ) {
      return
    }
    if (!dbTransferRoot?.transferHashes.length) {
      this.logger.warn(
        `db transfer root ${dbTransferRoot.transferRootHash} doesn't contain any transfer hashes`
      )
      return
    }
    let transferHashes: string[] = Object.values(
      dbTransferRoot.transferHashes || []
    )
    const totalAmount = dbTransferRoot.totalAmount
    if (!totalAmount) {
      return
    }
    const bonder = dbTransfer.withdrawalBonder
    if (!chainId) {
      return
    }
    if (!dbTransfer.transferRootHash) {
      this.logger.warn(
        `db transfer hash ${dbTransfer.transferHash} is missing transfer root hash`
      )
      return
    }
    if (!bonder) {
      this.logger.warn(
        `db transfer hash ${dbTransfer.transferHash} is missing bond withdrawal bonder`
      )
      return
    }
    if (!dbTransferRoot.commited) {
      this.logger.warn(
        `db transfer hash ${dbTransfer.transferHash} has not been committed onchain`
      )
      return
    }
    const commitedAt = dbTransferRoot.commitedAt
    if (!commitedAt) {
      return
    }
    try {
      const bridge = this.siblingWatchers[chainId].bridge
      await this.bridge.waitSafeConfirmations()

      this.logger.debug(
        'transferRootHash:',
        chalk.bgMagenta.black(dbTransfer.transferRootHash)
      )
      if (!transferHashes.length) {
        this.logger.warn('no transfer hashes to settle')
        return
      }
      const tree = new MerkleTree(transferHashes)
      const transferRootHash = tree.getHexRoot()
      this.logger.debug('committedAt:', commitedAt)
      this.logger.debug('sourceChainId:', dbTransfer.sourceChainId)
      this.logger.debug('destinationChainId:', chainId)
      this.logger.debug('transferHashes:', transferHashes)
      this.logger.debug('transferRootHash:', transferRootHash)
      this.logger.debug('totalAmount:', this.bridge.formatUnits(totalAmount))

      if (transferRootHash !== dbTransfer.transferRootHash) {
        this.logger.warn(`computed transfer root hash doesn't match`)
        return
      }

      const transferBondStruct = await bridge.getTransferRoot(
        transferRootHash,
        totalAmount
      )

      const structTotalAmount = transferBondStruct.total
      const structAmountWithdrawn = transferBondStruct.amountWithdrawn
      const createdAt = Number(transferBondStruct?.createdAt.toString())
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
        this.logger.warn(
          'transferRoot total amount is 0. Cannot settle until transfer root is set'
        )
        return
      }

      let totalBondsSettleAmount = BigNumber.from(0)
      for (let transferHash of transferHashes) {
        const transferBondAmount = await bridge.getBondedWithdrawalAmountByBonder(
          bonder,
          transferHash
        )
        totalBondsSettleAmount = totalBondsSettleAmount.add(transferBondAmount)
      }

      let [credit, debit, bondedBondedWithdrawalsBalance] = await Promise.all([
        bridge.getCredit(),
        bridge.getDebit(),
        bridge.getBonderBondedWithdrawalsBalance()
      ])
      const bonderDestBridgeStakedAmount = credit
        .sub(debit)
        .add(bondedBondedWithdrawalsBalance)
      if (totalBondsSettleAmount.eq(0)) {
        this.logger.warn('totalBondsSettleAmount is 0. Cannot settle')
        return
      }
      if (
        totalBondsSettleAmount
          .div(bonderDestBridgeStakedAmount)
          .lt(BigNumber.from(this.minThresholdPercent * 100).div(100))
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

      for (let transferHash of transferHashes) {
        let dbTransfer = await db.transfers.getByTransferHash(transferHash)
        if (
          dbTransfer?.withdrawalBondSettleTxSent ||
          dbTransfer?.withdrawalBondSettled
        ) {
          this.logger.debug(
            'sent?:',
            !!dbTransfer.withdrawalBondSettleTxSent,
            'settled?:',
            !!dbTransfer.withdrawalBondSettled
          )
          return
        }
      }

      if (this.dryMode) {
        this.logger.warn(
          'dry mode: skipping settleBondedWithdrawals transaction'
        )
        return
      }

      for (let transferHash of transferHashes) {
        await db.transfers.update(transferHash, {
          withdrawalBondSettleTxSent: true
        })
      }
      this.logger.debug('sending settle tx')
      const tx = await this.settleBondedWithdrawals(
        bonder,
        transferHashes,
        totalAmount,
        chainId
      )
      tx?.wait()
        .then(async (receipt: any) => {
          if (receipt.status !== 1) {
            for (let transferHash of transferHashes) {
              await db.transfers.update(transferHash, {
                withdrawalBondSettleTxSent: true
              })
            }
            throw new Error('status=0')
          }
          this.emit('settleBondedWithdrawal', {
            transferRootHash,
            networkName: networkIdToSlug(chainId),
            networkId: chainId,
            transferHash: dbTransfer.transferHash
          })

          for (let transferHash of transferHashes) {
            await db.transfers.update(transferHash, {
              withdrawalBondSettled: true
            })
          }
        })
        .catch(async (err: Error) => {
          await db.transfers.update(dbTransfer.transferHash, {
            withdrawalBondSettleTxSent: false
          })

          throw err
        })
      this.logger.info(
        `settleBondedWithdrawals on chainId:${chainId} tx: ${chalk.bgYellow.black.bold(
          tx.hash
        )}`
      )
      this.notifier.info(
        `settleBondedWithdrawals on chainId:${chainId} tx: ${tx.hash}`
      )
    } catch (err) {
      if (err.message !== 'cancelled') {
        console.log(err)
        this.logger.error(`settleBondedWithdrawal error:`, err.message)
        this.notifier.error(`settleBondedWithdrawal error: ${err.message}`)
      }
      await db.transfers.update(dbTransfer.transferHash, {
        withdrawalBondSettleTxSent: false
      })
    }
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
