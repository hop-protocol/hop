import '../moduleAlias'
import { Contract, BigNumber } from 'ethers'
import { parseUnits, formatUnits } from 'ethers/lib/utils'
import { wait, networkIdToSlug, isL1NetworkId } from 'src/utils'
import db from 'src/db'
import { TransferRoot } from 'src/db/TransferRootsDb'
import { Transfer } from 'src/db/TransfersDb'
import chalk from 'chalk'
import BaseWatcher from './classes/BaseWatcher'
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

      const withdrawalsSettledEvents = await this.bridge.getMultipleWithdrawalsSettledEvents(
        start,
        end
      )

      for (let event of withdrawalsSettledEvents) {
        const { bonder, rootHash, totalBondsSettled } = event.args
        await this.handleMultipleWithdrawalsSettled(
          bonder,
          rootHash,
          totalBondsSettled
        )
      }
    }, this.bridge.TransferRootSet)
    this.logger.debug('done syncing')
  }

  async watch () {
    this.bridge
      .on(this.bridge.TransferRootSet, this.handleTransferRootSetEvent)
      .on(
        this.bridge.MultipleWithdrawalsSettled,
        this.handleMultipleWithdrawalsSettled
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
      await wait(10 * 1000)
    }
  }

  handleTransferRootSetEvent = async (
    transferRootHash: string,
    totalAmount: BigNumber,
    meta: any
  ) => {
    let dbTransferRoot = await db.transferRoots.getByTransferRootHash(
      transferRootHash
    )
    if (!dbTransferRoot) {
      return
    }
    const { transactionHash } = meta
    //const { timestamp } = await meta.getTransaction()
    const decimals = await this.getBridgeTokenDecimals(
      this.bridge.providerNetworkId
    )
    const transferRootId = await this.bridge.getTransferRootId(
      transferRootHash,
      totalAmount
    )
    this.logger.debug(`received L1 BondTransferSet event:`)
    this.logger.debug(`transferRootHash from event: ${transferRootHash}`)
    this.logger.debug(`transferRootId: ${transferRootId}`)
    this.logger.debug(`bondAmount: ${this.bridge.formatUnits(totalAmount)}`)
    this.logger.debug(`event transactionHash: ${transactionHash}`)
    await db.transferRoots.update(transferRootHash, {
      committed: true,
      transferRootId,
      transferRootHash
    })
    if (!dbTransferRoot.transferIds?.length) {
      this.logger.debug(
        `looking for transfer ids for transferRootHash ${transferRootHash}`
      )
      const sourceChainId = dbTransferRoot.sourceChainId
      if (!this.siblingWatchers[sourceChainId]) {
        this.logger.error(`no sibling watcher found for ${sourceChainId}`)
        return
      }
      const sourceBridge = this.siblingWatchers[sourceChainId]
        .bridge as L2Bridge
      // events are sorted from [newest...oldest]
      let allEvents: any[] = []
      let i = 0
      let endIndex = -1
      await sourceBridge.eventsBatch(async (start: number, end: number) => {
        const events = await sourceBridge.getTransfersCommittedEvents(
          start,
          end
        )
        allEvents.push(...events.reverse())
        for (let event of events) {
          if (event.args.rootHash === transferRootHash) {
            endIndex = i
          }
          if (endIndex > -1 && i > endIndex + 1) {
            return false
          }
          i++
          return true
        }
      })

      if (endIndex > -1) {
        const event = allEvents[endIndex]
        const endTx = await event.getTransaction()
        const endBlock = endTx.blockNumber
        const prevEvent = allEvents[endIndex + 1]
        if (prevEvent) {
          let startTx = await prevEvent.getTransaction()
          let startBlock = startTx.blockNumber
          const transferEvents = await sourceBridge.getTransferSentEvents(
            startBlock,
            endBlock
          )
          let transferIds: string[] = []
          for (let event of transferEvents) {
            transferIds.push(event.args.transferId)
          }
          this.logger.debug(
            `found transfer ids for transfer root hash ${transferRootHash}\n`,
            transferIds
          )
          const tree = new MerkleTree(transferIds)
          const computedTransferRootHash = tree.getHexRoot()
          if (computedTransferRootHash !== transferRootHash) {
            this.logger.error(
              `computed transfer root hash doesn't match. Expected ${transferRootHash}, got ${computedTransferRootHash}`
            )
            return
          }
          await db.transferRoots.update(transferRootHash, {
            transferIds
          })
        }
      }
    }

    dbTransferRoot = await db.transferRoots.getByTransferRootHash(
      transferRootHash
    )
    if (!dbTransferRoot) {
      return
    }
    if (!dbTransferRoot.transferIds?.length) {
      this.logger.warn(
        `no db transfers found for transfer root ${transferRootHash}`
      )
      return
    }
    for (let dbTransferId of dbTransferRoot.transferIds) {
      const dbTransfer = await db.transfers.getByTransferId(dbTransferId)
      if (!dbTransfer) {
        this.logger.warn(`no db transfer found for transfer id ${dbTransferId}`)
      }
      await db.transfers.update(dbTransferId, {
        transferRootId,
        transferRootHash
      })
      if (!dbTransfer.transferRootId) {
        this.logger.debug(
          `updated db transfer hash ${dbTransferId} to have transfer root id ${transferRootId}`
        )
      }
    }
  }

  handleMultipleWithdrawalsSettled = async (
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
    const bridge = this.siblingWatchers[chainId].bridge
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
    //const tid = '0x1a9fc240502401cfc0ee4a29972408045e8ec2b822c274195cdca41bce40e726'
    //console.log('foo', await db.transfers.getByTransferId(tid))
    // 0x4e88b0f9d1110457e57e9c61f81c825576fa5045dbb04906bc8d56965a773945
    //const tr = await db.transferRoots.getByTransferRootId('0x4e88b0f9d1110457e57e9c61f81c825576fa5045dbb04906bc8d56965a773945')
    //const tr = await db.transferRoots.getByTransferRootHash('0x1f679dcb39307d3aa7482a809943bc65477779ca10c3d2fdf4c6d4e8e0b489cd')
    //console.log('tr', tr)
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
      const bridge = this.siblingWatchers[chainId].bridge
      await this.bridge.waitSafeConfirmations()
      const dbTransferRoot = await db.transferRoots.getByTransferRootHash(
        dbTransfer.transferRootHash
      )
      this.logger.debug('transferRootHash:', dbTransfer.transferRootHash)
      this.logger.debug(
        'transferRootId:',
        chalk.bgMagenta.black(dbTransfer.transferRootId)
      )
      if (!transferIds.length) {
        this.logger.warn('no transfer ids to settle')
        return
      }
      const tree = new MerkleTree(transferIds)
      const transferRootHash = tree.getHexRoot()
      if (transferRootHash !== dbTransferRoot.transferRootHash) {
        this.logger.debug('transferIds:\n', transferIds)
        this.logger.error(
          `computed transfer root hash doesn't match. Expected ${dbTransferRoot.transferRootHash}`
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
        this.logger.warn(
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

      this.logger.debug('committedAt:', committedAt)
      this.logger.debug('sourceChainId:', dbTransfer.sourceChainId)
      this.logger.debug('destinationChainId:', chainId)
      this.logger.debug('computed transferRootHash:', transferRootHash)
      this.logger.debug('totalAmount:', this.bridge.formatUnits(totalAmount))
      this.logger.debug(
        'struct total amount:',
        this.bridge.formatUnits(structTotalAmount)
      )
      this.logger.debug(
        'struct withdrawnAmount:',
        this.bridge.formatUnits(structAmountWithdrawn)
      )
      this.logger.debug('struct createdAt:', createdAt)

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

      for (let transferId of transferIds) {
        let dbTransfer = await db.transfers.getByTransferId(transferId)
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

      this.logger.debug('transferIds:\n', transferIds)

      if (this.dryMode) {
        this.logger.warn(
          'dry mode: skipping settleBondedWithdrawals transaction'
        )
        return
      }

      for (let transferId of transferIds) {
        await db.transfers.update(transferId, {
          withdrawalBondSettleTxSent: true
        })
      }
      this.logger.debug('sending settle tx')
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
                withdrawalBondSettleTxSent: true
              })
            }
            throw new Error('status=0')
          }
          this.emit('settleBondedWithdrawal', {
            transferRootHash,
            networkName: networkIdToSlug(chainId),
            networkId: chainId,
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
        this.logger.error(`settleBondedWithdrawal error:`, err.message)
        this.notifier.error(`settleBondedWithdrawal error: ${err.message}`)
      }
      await db.transfers.update(dbTransfer.transferId, {
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

  async waitTimeout (transferId: string, chainId: number) {
    await wait(2 * 1000)
    if (!this.order()) {
      return
    }
    this.logger.debug(
      `waiting for settle bonded withdrawal event. transferId: ${transferId} chainId: ${chainId}`
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
    this.logger.debug(`transfer id already bonded ${transferId}`)
    throw new Error('cancelled')
  }
}

export default SettleBondedWithdrawalWatcher
