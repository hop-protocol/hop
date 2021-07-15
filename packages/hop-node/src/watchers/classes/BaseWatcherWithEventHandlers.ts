import BaseWatcher from './BaseWatcher'
import L2Bridge from './L2Bridge'
import MerkleTree from 'src/utils/MerkleTree'
import chalk from 'chalk'
import db from 'src/db'
import { BigNumber, Contract } from 'ethers'
import { Event } from 'src/types'
import { boundClass } from 'autobind-decorator'
import { isL1ChainId } from 'src/utils'

interface Config {
  chainSlug: string
  tag: string
  prefix?: string
  logColor?: string
  order?: () => number
  isL1?: boolean
  bridgeContract?: Contract
  dryMode?: boolean
}

@boundClass
class BaseWatcherWithEventHandlers extends BaseWatcher {
  async handleTransferSentEvent (
    transferId: string,
    destinationChainIdBn: BigNumber,
    recipient: string,
    amount: BigNumber,
    transferNonce: string,
    bonderFee: BigNumber,
    index: string,
    amountOutMin: BigNumber,
    deadline: BigNumber,
    event: Event
  ) {
    const logger = this.logger.create({ id: transferId })
    logger.debug('handling TransferSent event')

    try {
      const { transactionHash, transactionIndex } = event
      const blockNumber: number = event.blockNumber
      if (!transactionHash) {
        throw new Error('event transaction hash not found')
      }
      if (!blockNumber) {
        throw new Error('event block number not found')
      }
      const l2Bridge = this.bridge as L2Bridge
      const destinationChainId = Number(destinationChainIdBn.toString())
      const sourceChainId = await l2Bridge.getChainId()
      const existingTransfer = await db.transfers.getByTransferId(transferId)
      const isBondable = existingTransfer?.isBondable ?? true

      logger.debug('transfer event amount:', this.bridge.formatUnits(amount))
      logger.debug('destinationChainId:', destinationChainId)
      logger.debug('transferId:', chalk.bgCyan.black(transferId))

      await db.transfers.update(transferId, {
        transferId,
        destinationChainId,
        sourceChainId,
        recipient,
        amount,
        transferNonce,
        bonderFee,
        amountOutMin,
        isBondable,
        deadline: Number(deadline.toString()),
        transferSentTxHash: transactionHash,
        transferSentBlockNumber: blockNumber,
        transferSentIndex: transactionIndex
      })
    } catch (err) {
      logger.error(`handleTransferSentEvent error: ${err.message}`)
      this.notifier.error(`handleTransferSentEvent error: ${err.message}`)
    }
  }

  async handleWithdrawalBondedEvent (
    transferId: string,
    amount: BigNumber,
    event: Event
  ) {
    const logger = this.logger.create({ id: transferId })

    const { transactionHash } = event
    const tx = await this.bridge.getTransaction(transactionHash)
    const { from: withdrawalBonder } = tx

    logger.debug('handling WithdrawalBonded event')
    logger.debug('transferId:', transferId)
    logger.debug('amount:', this.bridge.formatUnits(amount))

    await db.transfers.update(transferId, {
      withdrawalBonded: true,
      withdrawalBonder,
      withdrawalBondedTxHash: transactionHash
    })
  }

  async handleTransferRootConfirmedEvent (
    sourceChainId: BigNumber,
    destChainId: BigNumber,
    transferRootHash: string,
    totalAmount: BigNumber,
    event: Event
  ) {
    const logger = this.logger.create({ root: transferRootHash })
    logger.debug('handling TransferRootConfirmed event')

    try {
      const { transactionHash } = event
      await db.transferRoots.update(transferRootHash, {
        confirmed: true,
        confirmTxHash: transactionHash
      })
    } catch (err) {
      logger.error(`handleTransferRootConfirmedEvent error: ${err.message}`)
      this.notifier.error(
        `handleTransferRootConfirmedEvent error: ${err.message}`
      )
    }
  }

  async handleTransferRootBondedEvent (
    transferRootHash: string,
    totalAmount: BigNumber,
    event: Event
  ) {
    const logger = this.logger.create({ root: transferRootHash })
    logger.debug('handling TransferRootBonded event')

    try {
      const { transactionHash } = event
      const tx = await this.bridge.getTransaction(transactionHash)
      const { from: bonder } = tx
      const transferRootId = await this.bridge.getTransferRootId(
        transferRootHash,
        totalAmount
      )

      logger.debug(`transferRootHash from event: ${transferRootHash}`)
      logger.debug(`bondAmount: ${this.bridge.formatUnits(totalAmount)}`)
      logger.debug(`transferRootId: ${transferRootId}`)
      logger.debug(`event transactionHash: ${transactionHash}`)
      logger.debug(`bonder: ${bonder}`)

      await db.transferRoots.update(transferRootHash, {
        transferRootHash,
        transferRootId,
        committed: true,
        bonded: true,
        bonder,
        bondTxHash: transactionHash
      })
    } catch (err) {
      logger.error(`handleTransferRootBondedEvent error: ${err.message}`)
      this.notifier.error(`handleTransferRootBondedEvent error: ${err.message}`)
    }
  }

  async handleTransfersCommittedEvent (
    destinationChainIdBn: BigNumber,
    transferRootHash: string,
    totalAmount: BigNumber,
    committedAtBn: BigNumber,
    event: Event
  ) {
    const logger = this.logger.create({ root: transferRootHash })
    logger.debug('handling TransfersCommitted event')

    try {
      const committedAt = Number(committedAtBn.toString())
      const { transactionHash } = event
      const l2Bridge = this.bridge as L2Bridge

      const sourceChainId = await l2Bridge.getChainId()
      const destinationChainId = Number(destinationChainIdBn.toString())
      let destinationBridgeAddress: string
      const isExitWatcher = !this.hasSiblingWatcher(destinationChainId)
      if (!isExitWatcher) {
        destinationBridgeAddress = await this.getSiblingWatcherByChainId(
          destinationChainId
        ).bridge.getAddress()
      }
      const transferRootId = await this.bridge.getTransferRootId(
        transferRootHash,
        totalAmount
      )
      const blockNumber: number = event.blockNumber

      logger.debug('committedAt:', committedAt)
      logger.debug('totalAmount:', this.bridge.formatUnits(totalAmount))
      logger.debug('transferRootHash:', transferRootHash)
      logger.debug('destinationChainId:', destinationChainId)

      await db.transferRoots.update(transferRootHash, {
        transferRootHash,
        transferRootId,
        totalAmount,
        committedAt,
        destinationChainId,
        destinationBridgeAddress,
        sourceChainId,
        committed: true,
        commitTxHash: transactionHash,
        commitTxBlockNumber: blockNumber
      })
    } catch (err) {
      logger.error(`handleTransfersCommittedEvent error: ${err.message}`)
      this.notifier.error(`handleTransfersCommittedEvent error: ${err.message}`)
    }
  }

  async handleTransfersCommittedEventForTransferIds (
    destinationChainIdBn: BigNumber,
    transferRootHash: string,
    totalAmount: BigNumber,
    committedAtBn: BigNumber,
    event: Event
  ) {
    const logger = this.logger.create({ root: transferRootHash })

    const sourceChainId = await this.bridge.getChainId()
    const destinationChainId = Number(destinationChainIdBn.toString())
    await db.transferRoots.update(transferRootHash, {
      sourceChainId,
      destinationChainId
    })

    if (isL1ChainId(sourceChainId)) {
      return
    }
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
    let startEvent: Event
    let endEvent: Event
    await sourceBridge.eventsBatch(async (start: number, end: number) => {
      startSearchBlockNumber = start
      let events = await sourceBridge.getTransfersCommittedEvents(start, end)
      if (!events?.length) {
        return true
      }

      // events need to be sorted from [newest...oldest] in order to pick up the endEvent first
      events = events.reverse()
      for (const event of events) {
        const eventDbTransferRoot = await db.transferRoots.getByTransferRootHash(
          event.args.rootHash
        )

        if (event.args.rootHash === transferRootHash) {
          endEvent = event
          continue
        }

        const isSameChainId =
          eventDbTransferRoot?.destinationChainId === destinationChainId
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
    const endBlockNumber = endEvent.blockNumber
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

      // There is an error if there is no startBlockNumber at this point unless this is the first sync and the first
      // root hash cannot be reconstructed because we do not go back far enough to find the next TransfersCommitted
      // event. In this case, use this error log as an informative warning rather than an error.
      if (!startBlockNumber) {
        logger.error(
          `Too many blocks between two TransfersCommitted events. Search Start: ${startSearchBlockNumber}. End Event: ${endEvent.blockNumber}`
        )
        return
      }
    }

    const transferIds: string[] = []
    await sourceBridge.eventsBatch(
      async (start: number, end: number) => {
        let transferEvents = await sourceBridge.getTransferSentEvents(
          start,
          end
        )

        // transferEvents need to be sorted from [newest...oldest] in order to maintain the ordering
        transferEvents = transferEvents.reverse()
        for (const event of transferEvents) {
          const transaction = await sourceBridge.getTransaction(
            event.transactionHash
          )
          const {
            destinationChainId: decodedDestinationChainId
          } = await sourceBridge.decodeSendData(transaction.data)
          if (decodedDestinationChainId !== destinationChainId) {
            continue
          }

          // TransferSent events must be handled differently when they exist in the
          // same block or same transaction as a TransfersCommitted event
          if (startEvent && event.blockNumber === startEvent.blockNumber) {
            if (event.transactionIndex < startEvent.transactionIndex) {
              continue
            }
          }

          if (event.blockNumber === endEvent.blockNumber) {
            // If TransferSent is in the same tx as TransfersCommitted or later,
            // the transferId should be included in the next transferRoot
            if (event.transactionIndex >= endEvent.transactionIndex) {
              continue
            }
          }

          transferIds.unshift(event.args.transferId)
        }
      },
      { startBlockNumber, endBlockNumber }
    )

    logger.debug(
      `found transfer ids for transfer root hash ${transferRootHash}\n`,
      JSON.stringify(transferIds)
    )
    const tree = new MerkleTree(transferIds)
    const computedTransferRootHash = tree.getHexRoot()
    if (computedTransferRootHash !== transferRootHash) {
      logger.error(
        `computed transfer root hash doesn't match. Expected ${transferRootHash}, got ${computedTransferRootHash}`
      )
      return
    }

    const transferRootId = await this.bridge.getTransferRootId(
      transferRootHash,
      totalAmount
    )

    await db.transferRoots.update(transferRootHash, {
      transferIds,
      totalAmount,
      sourceChainId
    })

    for (const transferId of transferIds) {
      await db.transfers.update(transferId, {
        transferRootHash,
        transferRootId
      })
    }
  }
}

export default BaseWatcherWithEventHandlers
