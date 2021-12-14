import '../moduleAlias'
import BaseWatcher from './classes/BaseWatcher'
import MerkleTree from 'src/utils/MerkleTree'
import { L1Bridge as L1BridgeContract } from '@hop-protocol/core/contracts/L1Bridge'
import { L1ERC20Bridge as L1ERC20BridgeContract } from '@hop-protocol/core/contracts/L1ERC20Bridge'
import { L2Bridge as L2BridgeContract } from '@hop-protocol/core/contracts/L2Bridge'
import { Transfer } from 'src/db/TransfersDb'
import { OneHourMs } from 'src/constants'

type Config = {
  chainSlug: string
  tokenSymbol: string
  isL1: boolean
  bridgeContract: L1BridgeContract | L1ERC20BridgeContract | L2BridgeContract
  label: string
  order?: () => number
  dryMode?: boolean
  minThresholdPercent: number
  stateUpdateAddress?: string
}

class SettleBondedWithdrawalWatcher extends BaseWatcher {
  siblingWatchers: { [chainId: string]: SettleBondedWithdrawalWatcher }
  settleAttemptedAt: { [rootHash: string]: number } = {}

  constructor (config: Config) {
    super({
      chainSlug: config.chainSlug,
      tokenSymbol: config.tokenSymbol,
      tag: 'SettleBondedWithdrawalWatcher',
      prefix: config.label,
      logColor: 'magenta',
      order: config.order,
      isL1: config.isL1,
      bridgeContract: config.bridgeContract,
      dryMode: config.dryMode,
      stateUpdateAddress: config.stateUpdateAddress
    })
  }

  async pollHandler () {
    await this.checkUnsettledTransferRootsFromDb()
  }

  checkUnsettledTransferRootsFromDb = async () => {
    const dbTransferRoots = await this.db.transferRoots.getUnsettledTransferRoots(await this.getFilterRoute())

    const promises: Array<Promise<any>> = []
    for (const dbTransferRoot of dbTransferRoots) {
      const { transferRootHash, transferIds } = dbTransferRoot
      if (!transferRootHash) {
        throw new Error('expected transferRootHash')
      }

      if (!transferIds) {
        throw new Error('expected transferIds list')
      }

      // Mark a settlement as attempted here so that multiple db reads are not attempted every poll
      // This comes into play when a transfer is bonded after others in the same root have been settled
      if (!this.settleAttemptedAt[transferRootHash]) {
        this.settleAttemptedAt[transferRootHash] = 0
      }
      const timestampOk = this.settleAttemptedAt[transferRootHash] + OneHourMs < Date.now()
      if (!timestampOk) {
        continue
      }
      this.settleAttemptedAt[transferRootHash] = Date.now()

      // get all db transfer items that belong to root
      const dbTransfers: Transfer[] = []
      for (const transferId of transferIds) {
        const dbTransfer = await this.db.transfers.getByTransferId(transferId)
        if (!dbTransfer) {
          continue
        }
        dbTransfers.push(dbTransfer)
      }

      if (dbTransfers.length !== transferIds.length) {
        this.logger.error(`could not find all db transfers for root hash ${transferRootHash}. Has ${transferIds.length}, found ${dbTransfers.length}. Db may not be fully synced`)
        continue
      }

      // skip attempt to settle transfer root if none of the transfers are bonded because there is nothing to settle
      const hasBondedWithdrawals = dbTransfers.some(
        (dbTransfer: Transfer) => dbTransfer.withdrawalBonded
      )
      if (!hasBondedWithdrawals) {
        continue
      }

      const allBondableTransfersSettled = this.syncWatcher.getIsDbTransfersAllSettled(dbTransfers)
      if (allBondableTransfersSettled) {
        await this.db.transferRoots.update(transferRootHash, {
          allSettled: true
        })
        continue
      }

      // find all unique bonders that have bonded transfers in this transfer root
      const bonderSet = new Set<string>()
      for (const dbTransfer of dbTransfers) {
        const doesBonderExist = dbTransfer?.withdrawalBonder
        const shouldTransferBeSettled = dbTransfer?.withdrawalBondSettled === false
        if (!doesBonderExist || !shouldTransferBeSettled) {
          continue
        }
        bonderSet.add(dbTransfer.withdrawalBonder!) // eslint-disable-line @typescript-eslint/no-non-null-assertion
      }

      for (const bonder of bonderSet.values()) {
        // check settle-able transfer root
        promises.push(
          this.checkTransferRootHash(transferRootHash, bonder)
            .catch((err: Error) => {
              this.logger.error('checkTransferRootHash error:', err.message)
            })
        )
      }
    }

    if (promises.length === 0) {
      return
    }

    this.logger.info(
      `checking ${promises.length} unsettled db transfer roots`
    )

    await Promise.all(promises)
  }

  checkTransferRootHash = async (transferRootHash: string, bonder: string) => {
    if (!transferRootHash) {
      throw new Error('transfer root hash is required')
    }
    if (!bonder) {
      throw new Error('bonder is required')
    }
    const logger = this.logger.create({ root: transferRootHash })
    const dbTransferRoot = await this.db.transferRoots.getByTransferRootHash(
      transferRootHash
    )
    const {
      transferRootId,
      sourceChainId,
      destinationChainId,
      totalAmount,
      transferIds
    } = dbTransferRoot
    if (!Array.isArray(transferIds)) {
      throw new Error('transferIds expected to be array')
    }

    const destBridge = this.getSiblingWatcherByChainId(destinationChainId!) // eslint-disable-line @typescript-eslint/no-non-null-assertion
      .bridge

    logger.debug(`transferRootId: ${transferRootId}`)

    const tree = new MerkleTree(transferIds)
    const calculatedTransferRootHash = tree.getHexRoot()
    if (calculatedTransferRootHash !== transferRootHash) {
      logger.debug('transferIds:', JSON.stringify(transferIds))
      logger.error(
        `transfers computed transfer root hash doesn't match. Expected ${transferRootHash}, got ${calculatedTransferRootHash}`
      )
      await this.db.transferRoots.update(transferRootHash, {
        transferIds: []
      })
      return
    }

    logger.debug('sourceChainId:', sourceChainId)
    logger.debug('destinationChainId:', destinationChainId)
    logger.debug('computed transferRootHash:', transferRootHash)
    logger.debug('bonder:', bonder)
    logger.debug('totalAmount:', this.bridge.formatUnits(totalAmount!)) // eslint-disable-line @typescript-eslint/no-non-null-assertion
    logger.debug('transferIds', JSON.stringify(transferIds))

    const transferRootStruct = await this.bridge.getTransferRoot(transferRootHash, totalAmount!) // eslint-disable-line @typescript-eslint/no-non-null-assertion
    if (transferRootStruct.amountWithdrawn.eq(totalAmount!)) { // eslint-disable-line @typescript-eslint/no-non-null-assertion
      logger.debug(`transfer root amountWithdrawn (${this.bridge.formatUnits(transferRootStruct.amountWithdrawn)}) matches totalAmount (${this.bridge.formatUnits(totalAmount!)}). Marking transfer root as all settled`) // eslint-disable-line @typescript-eslint/no-non-null-assertion
      await this.db.transferRoots.update(transferRootHash, {
        allSettled: true
      })
      return
    }

    await this.handleStateSwitch()
    if (this.isDryOrPauseMode) {
      logger.warn(`dry: ${this.dryMode}, pause: ${this.pauseMode}. skipping settleBondedWithdrawals`)
      return
    }

    await this.db.transferRoots.update(transferRootHash, {
      withdrawalBondSettleTxSentAt: Date.now()
    })
    logger.debug('sending settle tx')
    try {
      const tx = await destBridge.settleBondedWithdrawals(
        bonder,
        transferIds,
        totalAmount
      )
      const msg = `settleBondedWithdrawals on destinationChainId:${destinationChainId} tx: ${tx.hash}`
      logger.info(msg)
      this.notifier.info(msg)
    } catch (err) {
      logger.error(err.message)
      throw err
    }
  }

  checkTransferId = async (transferId: string) => {
    const dbTransfer = await this.db.transfers.getByTransferId(transferId)
    if (!dbTransfer) {
      throw new Error(`transfer id "${transferId}" not found in db`)
    }
    const { transferRootHash, withdrawalBonder } = dbTransfer
    const dbTransferRoot = await this.db.transferRoots.getByTransferRootHash(
      transferRootHash! // eslint-disable-line @typescript-eslint/no-non-null-assertion
    )
    if (!dbTransferRoot) {
      throw new Error(`transfer root hash "${transferRootHash}" not found in db`)
    }

    return await this.checkTransferRootHash(transferRootHash!, withdrawalBonder!) // eslint-disable-line @typescript-eslint/no-non-null-assertion
  }
}

export default SettleBondedWithdrawalWatcher
