import '../moduleAlias'
import { Contract, BigNumber, Event } from 'ethers'
import { parseUnits, formatUnits } from 'ethers/lib/utils'
import { wait, isL1ChainId } from 'src/utils'
import db from 'src/db'
import { TransferRoot } from 'src/db/TransferRootsDb'
import { Transfer } from 'src/db/TransfersDb'
import chalk from 'chalk'
import BaseWatcherWithEventHandlers from './classes/BaseWatcherWithEventHandlers'
import Bridge from './classes/Bridge'
import L1Bridge from './classes/L1Bridge'
import L2Bridge from './classes/L2Bridge'
import Token from './classes/Token'
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

class SettleBondedWithdrawalWatcher extends BaseWatcherWithEventHandlers {
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

  async syncUp (): Promise<any> {
    this.logger.debug('syncing up events')

    const promises: Promise<any>[] = []
    promises.push(
      this.eventsBatch(async (start: number, end: number) => {
        const events = await this.bridge.getTransferRootSetEvents(start, end)
        await this.handleTransferRootSetEvents(events)
        //}, this.bridge.TransferRootSet)
      })
    )

    promises.push(
      this.eventsBatch(async (start: number, end: number) => {
        const events = await this.bridge.getMultipleWithdrawalsSettledEvents(start, end)
        await this.handleMultipleWithdrawalsSettledEvents(events)
        //}, this.bridge.TransferRootSet)
      })
    )

    await Promise.all(promises)
    this.logger.debug('done syncing')

    // re-sync every 6 hours
    const sixHours = this.syncTimeSec
    await wait(sixHours)
    return this.syncUp()
  }

  async watch () {
    this.bridge
      .on(this.bridge.TransferRootSet, this.handleTransferRootSetEvent)
      .on(
        this.bridge.MultipleWithdrawalsSettled,
        this.handleMultipleWithdrawalsSettledEvent
      )
      .on('error', err => {
        this.logger.error(`event watcher error:`, err.message)
        this.quit()
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
      await wait(this.pollTimeSec)
    }
  }

  async handleTransferRootSetEvents (events: Event[]) {
    for (let event of events) {
      const { rootHash, totalAmount } = event.args
      await this.handleTransferRootSetEvent(rootHash, totalAmount, event)
    }
  }

  async handleMultipleWithdrawalsSettledEvents (events: Event[]) {
    for (let event of events) {
      const { bonder, rootHash, totalBondsSettled } = event.args
      await this.handleMultipleWithdrawalsSettledEvent(
        bonder,
        rootHash,
        totalBondsSettled
      )
    }
  }

  handleTransferRootSetEvent = async (
    transferRootHash: string,
    totalAmount: BigNumber,
    meta: any
  ) => {
    const logger = this.logger.create({ root: transferRootHash })
    let dbTransferRoot = await db.transferRoots.getByTransferRootHash(
      transferRootHash
    )
    if (!dbTransferRoot) {
      return
    }
    const { transactionHash } = meta
    const transferRootId = await this.bridge.getTransferRootId(
      transferRootHash,
      totalAmount
    )
    const sourceChainId =
      dbTransferRoot.sourceChainId || (await this.bridge.getChainId())
    const destinationChainId = dbTransferRoot.chainId

    logger.debug(`received TransferRootSet event from L1:`)
    logger.debug(`transferRootHash from event: ${transferRootHash}`)
    logger.debug(`transferRootId: ${transferRootId}`)
    logger.debug(`bondAmount: ${this.bridge.formatUnits(totalAmount)}`)
    logger.debug(`event transactionHash: ${transactionHash}`)
    await db.transferRoots.update(transferRootHash, {
      committed: true,
      transferRootId,
      transferRootHash,
      sourceChainId
    })
    if (!dbTransferRoot.transferIds?.length) {
      logger.debug(
        `looking for transfer ids for transferRootHash ${transferRootHash}`
      )
      if (!this.hasSiblingWatcher(sourceChainId)) {
        logger.error(`no sibling watcher found for ${sourceChainId}`)
        return
      }
      const sourceBridge = this.getSiblingWatcherByChainId(sourceChainId)
        .bridge as L2Bridge

      let startSearchBlockNumber: number
      let startEvent: any
      let endEvent: any
      await sourceBridge.eventsBatch(async (start: number, end: number) => {
        startSearchBlockNumber = start
        let events = await sourceBridge.getTransfersCommittedEvents(start, end)

        if (!events?.length) {
          return true
        }

        // events need to be sorted from [newest...oldest] in order to pick up the endEvent first
        events = events.reverse()
        for (let event of events) {
          let eventTransferRoot = await db.transferRoots.getByTransferRootHash(
            event.args.rootHash
          )

          if (event.args.rootHash === transferRootHash) {
            endEvent = event
            continue
          }

          const isSameChainId = eventTransferRoot.chainId === destinationChainId
          if (endEvent && isSameChainId) {
            startEvent = event
            return false
          }
        }

        return true
      })

      if (!endEvent) {
        return
      }

      let startBlockNumber
      let endBlockNumber = endEvent.blockNumber
      if (startEvent) {
        startBlockNumber = startEvent.blockNumber
      } else {
        // There will not be a startEvent if this was the first CommitTransfers event for
        // this token since the deployment of the bridge contract
        const sourceBridgeAddress = sourceBridge.getAddress()
        const codeAtAddress = await sourceBridge.getCode(
          sourceBridgeAddress,
          startSearchBlockNumber
        )
        if (codeAtAddress === '0x') {
          startBlockNumber = startSearchBlockNumber
        }

        // There is an unhandled case where there are too many blocks between two
        // TransfersCommitted events and startBlockNumber is never defined. This should
        // never happen in production.
      }

      let transferIds: string[] = []
      await sourceBridge.eventsBatch(
        async (start: number, end: number) => {
          let transferEvents = await sourceBridge.getTransferSentEvents(
            start,
            end
          )

          // transferEvents need to be sorted from [newest...oldest] in order to maintain the ordering
          transferEvents = transferEvents.reverse()
          for (let event of transferEvents) {
            const transaction = await sourceBridge.getTransaction(
              event.transactionHash
            )
            const { chainId } = await sourceBridge.decodeSendData(
              transaction.data
            )
            if (chainId !== destinationChainId) {
              continue
            }

            // When TransferSent and TransfersCommitted events exist in the same block, they
            // need to be scoped to the correct transferRoot
            if (startEvent && event.blockNumber === startEvent.blockNumber) {
              if (event.transactionIndex < startEvent.transactionIndex) {
                continue
              }
            }

            if (event.blockNumber === endEvent.blockNumber) {
              if (event.transactionIndex > endEvent.transactionIndex) {
                break
              }
            }

            transferIds.unshift(event.args.transferId)
          }
        },
        { startBlockNumber, endBlockNumber }
      )

      logger.debug(
        `found transfer ids for transfer root hash ${transferRootHash}\n`,
        transferIds
      )
      const tree = new MerkleTree(transferIds)
      const computedTransferRootHash = tree.getHexRoot()
      if (computedTransferRootHash !== transferRootHash) {
        logger.error(
          `computed transfer root hash doesn't match. Expected ${transferRootHash}, got ${computedTransferRootHash}`
        )
        return
      }
      await db.transferRoots.update(transferRootHash, {
        transferIds
      })
    }

    dbTransferRoot = await db.transferRoots.getByTransferRootHash(
      transferRootHash
    )
    if (!dbTransferRoot) {
      return
    }
    if (!dbTransferRoot.transferIds?.length) {
      logger.warn(`no db transfers found for transfer root ${transferRootHash}`)
      return
    }
    for (let dbTransferId of dbTransferRoot.transferIds) {
      const dbTransfer = await db.transfers.getByTransferId(dbTransferId)
      if (!dbTransfer) {
        logger.warn(`no db transfer found for transfer id ${dbTransferId}`)
      }
      await db.transfers.update(dbTransferId, {
        transferRootId,
        transferRootHash
      })
      if (!dbTransfer.transferRootId) {
        logger.debug(
          `updated db transfer hash ${dbTransferId} to have transfer root id ${transferRootId}`
        )
      }
    }
  }

  handleMultipleWithdrawalsSettledEvent = async (
    bonder: string,
    transferRootHash: string,
    totalBondsSettled: BigNumber
  ) => {
    let dbTransferRoot = await db.transferRoots.getByTransferRootHash(
      transferRootHash
    )
    if (!dbTransferRoot) {
      return
    }
    let transferIds = dbTransferRoot.transferIds || []
    for (let transferId of transferIds) {
      await db.transfers.update(transferId, {
        transferRootHash,
        withdrawalBondSettled: true
      })
    }
  }

  settleBondedWithdrawals = async (
    bonder: string,
    transferIds: string[],
    totalAmount: BigNumber,
    chainId: number
  ) => {
    const bridge = this.getSiblingWatcherByChainId(chainId).bridge
    const decimals = await this.getBridgeTokenDecimals(chainId)
    return bridge.settleBondedWithdrawals(bonder, transferIds, totalAmount)
  }

  checkUnsettledTransfers = async () => {
    const dbTransfers: Transfer[] = await db.transfers.getUnsettledBondedWithdrawalTransfers()
    for (let dbTransfer of dbTransfers) {
      try {
        await this.checkUnsettledTransfer(dbTransfer)
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
    if (!dbTransfer.transferRootHash) {
      this.logger.warn(
        `db transfer id ${dbTransfer.transferId} is missing transfer root hash`
      )
      return
    }
    const dbTransferRoot = await db.transferRoots.getByTransferRootHash(
      dbTransfer.transferRootHash
    )
    if (!dbTransferRoot) {
      return
    }
    const bridgeAddress = await this.bridge.getAddress()
    const chainId = dbTransfer.chainId
    // only process transfer where this bridge is the destination chain
    const bridgeChainId = await this.bridge.getChainId()
    if (chainId !== bridgeChainId) {
      return
    }
    if (
      dbTransferRoot.destinationBridgeAddress &&
      dbTransferRoot.destinationBridgeAddress !== bridgeAddress
    ) {
      return
    }
    if (!dbTransferRoot?.transferIds.length) {
      //this.logger.warn(`db transfer root hash ${dbTransferRoot.transferRootHash} doesn't contain any transfer ids`)
      return
    }
    let transferIds: string[] = Object.values(dbTransferRoot.transferIds || [])
    const totalAmount = dbTransferRoot.totalAmount
    if (!totalAmount) {
      return
    }
    const bonder = dbTransfer.withdrawalBonder
    if (!chainId) {
      return
    }
    if (!bonder) {
      this.logger.warn(
        `db transfer id ${dbTransfer.transferId} is missing bond withdrawal bonder`
      )
      return
    }
    if (!dbTransferRoot.committed) {
      this.logger.warn(
        `db transfer id ${dbTransfer.transferId} (transfer root hash ${dbTransferRoot.transferRootHash}) has not been committed onchain`
      )
      return
    }
    const committedAt = dbTransferRoot.committedAt
    if (!committedAt) {
      return
    }
    try {
      const bridge = this.getSiblingWatcherByChainId(chainId).bridge
      await this.bridge.waitSafeConfirmations()
      const dbTransferRoot = await db.transferRoots.getByTransferRootHash(
        dbTransfer.transferRootHash
      )
      const logger = this.logger.create({ root: dbTransfer.transferRootHash })
      logger.debug('transferRootHash:', dbTransfer.transferRootHash)
      logger.debug(
        'transferRootId:',
        chalk.bgMagenta.black(dbTransfer.transferRootId)
      )
      if (!transferIds.length) {
        logger.warn('no transfer ids to settle')
        return
      }
      const tree = new MerkleTree(transferIds)
      const transferRootHash = tree.getHexRoot()
      if (transferRootHash !== dbTransferRoot.transferRootHash) {
        logger.debug('transferIds:\n', transferIds)
        logger.error(
          `pending transfers computed transfer root hash doesn't match. Expected ${dbTransferRoot.transferRootHash}`
        )
        await db.transferRoots.update(dbTransferRoot.transferRootHash, {
          transferIds: []
        })
        return
      }

      const transferBondStruct = await bridge.getTransferRoot(
        transferRootHash,
        totalAmount
      )

      const structTotalAmount = transferBondStruct.total
      const structAmountWithdrawn = transferBondStruct.amountWithdrawn
      const createdAt = Number(transferBondStruct?.createdAt.toString())
      if (structTotalAmount.lte(0)) {
        logger.warn(
          'transferRoot total amount is 0. Cannot settle until transfer root is set'
        )
        return
      }

      let totalBondsSettleAmount = BigNumber.from(0)
      for (let transferId of transferIds) {
        const transferBondAmount = await bridge.getBondedWithdrawalAmountByBonder(
          bonder,
          transferId
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
        logger.warn('totalBondsSettleAmount is 0. Cannot settle')
        return
      }

      if (
        totalBondsSettleAmount
          .div(bonderDestBridgeStakedAmount)
          .lt(BigNumber.from(this.minThresholdPercent * 100).div(100))
      ) {
        logger.warn(
          `total bonded withdrawal amount ${this.bridge.formatUnits(
            totalBondsSettleAmount
          )} does not meet min threshold of ${this.minThresholdPercent *
            100}% of total staked ${this.bridge.formatUnits(
            bonderDestBridgeStakedAmount
          )}. Cannot settle yet`
        )
        return
      }

      logger.debug('committedAt:', committedAt)
      logger.debug('sourceChainId:', dbTransfer.sourceChainId)
      logger.debug('destinationChainId:', chainId)
      logger.debug('computed transferRootHash:', transferRootHash)
      logger.debug('totalAmount:', this.bridge.formatUnits(totalAmount))
      logger.debug(
        'struct total amount:',
        this.bridge.formatUnits(structTotalAmount)
      )
      logger.debug(
        'struct withdrawnAmount:',
        this.bridge.formatUnits(structAmountWithdrawn)
      )
      logger.debug('struct createdAt:', createdAt)

      logger.debug('totalBondedSettleAmount:', createdAt)
      const newAmountWithdrawn = structAmountWithdrawn.add(
        totalBondsSettleAmount
      )
      logger.debug(
        'newAmountWithdrawn:',
        this.bridge.formatUnits(newAmountWithdrawn)
      )
      if (newAmountWithdrawn.gt(structTotalAmount)) {
        logger.warn('withdrawal exceeds transfer root total')
        return
      }

      for (let transferId of transferIds) {
        let dbTransfer = await db.transfers.getByTransferId(transferId)
        if (
          dbTransfer?.withdrawalBondSettleTxSentAt ||
          dbTransfer?.withdrawalBondSettled
        ) {
          const tenMinutes = 60 * 10 * 1000
          if (
            dbTransfer.withdrawalBondSettleTxSentAt + tenMinutes >
            Date.now()
          ) {
            logger.debug(
              'sent?:',
              !!dbTransfer.withdrawalBondSettleTxSentAt,
              'settled?:',
              !!dbTransfer.withdrawalBondSettled
            )
          }
          return
        }
      }

      logger.debug('transferIds:\n', transferIds)

      if (this.dryMode) {
        logger.warn('dry mode: skipping settleBondedWithdrawals transaction')
        return
      }

      for (let transferId of transferIds) {
        await db.transfers.update(transferId, {
          withdrawalBondSettleTxSentAt: Date.now()
        })
      }
      logger.debug('sending settle tx')
      const tx = await this.settleBondedWithdrawals(
        bonder,
        transferIds,
        totalAmount,
        chainId
      )
      tx?.wait()
        .then(async (receipt: any) => {
          if (receipt.status !== 1) {
            for (let transferId of transferIds) {
              await db.transfers.update(transferId, {
                withdrawalBondSettleTxSentAt: Date.now()
              })
            }
            throw new Error('status=0')
          }
          this.emit('settleBondedWithdrawal', {
            transferRootHash,
            networkName: this.chainIdToSlug(chainId),
            chainId,
            transferId: dbTransfer.transferId
          })

          for (let transferId of transferIds) {
            await db.transfers.update(transferId, {
              transferRootHash,
              withdrawalBonded: true,
              withdrawalBondSettled: true
            })
          }
        })
        .catch(async (err: Error) => {
          await db.transfers.update(dbTransfer.transferId, {
            withdrawalBondSettleTxSentAt: 0
          })

          throw err
        })
      logger.info(
        `settleBondedWithdrawals on chainId:${chainId} tx: ${chalk.bgYellow.black.bold(
          tx.hash
        )}`
      )
      this.notifier.info(
        `settleBondedWithdrawals on chainId:${chainId} tx: ${tx.hash}`
      )
    } catch (err) {
      if (err.message !== 'cancelled') {
        this.logger.error(`settleBondedWithdrawal error:`, err.message)
        this.notifier.error(`settleBondedWithdrawal error: ${err.message}`)
      }
      await db.transfers.update(dbTransfer.transferId, {
        withdrawalBondSettleTxSentAt: 0
      })
    }
  }

  async getBridgeTokenDecimals (chainId: number) {
    let bridge: any
    let token: Token
    if (isL1ChainId(chainId)) {
      bridge = this.getSiblingWatcherByChainId(chainId).bridge as L1Bridge
      token = await bridge.l1CanonicalToken()
    } else {
      bridge = this.getSiblingWatcherByChainId(chainId).bridge as L2Bridge
      token = await bridge.hToken()
    }
    return token.decimals()
  }

  async waitTimeout (transferId: string, chainId: number) {
    await wait(2 * 1000)
    if (!this.order()) {
      return
    }
    this.logger.debug(
      `waiting for settle bonded withdrawal event. transferId: ${transferId} chainId: ${chainId}`
    )
    const bridge = this.getSiblingWatcherByChainId(chainId).bridge
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
    this.logger.debug(`transfer id already bonded ${transferId}`)
    throw new Error('cancelled')
  }
}

export default SettleBondedWithdrawalWatcher
