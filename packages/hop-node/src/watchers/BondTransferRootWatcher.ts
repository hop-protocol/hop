import '../moduleAlias'
import BaseWatcher from './classes/BaseWatcher'
import L1Bridge from './classes/L1Bridge'
import MerkleTree from 'src/utils/MerkleTree'
import getTransferRootId from 'src/utils/getTransferRootId'
import { BigNumber } from 'ethers'
import { L1Bridge as L1BridgeContract } from '@hop-protocol/core/contracts/L1Bridge'
import { L1ERC20Bridge as L1ERC20BridgeContract } from '@hop-protocol/core/contracts/L1ERC20Bridge'
import { L2Bridge as L2BridgeContract } from '@hop-protocol/core/contracts/L2Bridge'
export type Config = {
  chainSlug: string
  tokenSymbol: string
  bridgeContract: L1BridgeContract | L1ERC20BridgeContract | L2BridgeContract
  label: string
  isL1: boolean
  order?: () => number
  dryMode?: boolean
  stateUpdateAddress?: string
}

class BondTransferRootWatcher extends BaseWatcher {
  siblingWatchers: { [chainId: string]: BondTransferRootWatcher }

  constructor (config: Config) {
    super({
      chainSlug: config.chainSlug,
      tokenSymbol: config.tokenSymbol,
      tag: 'BondTransferRootWatcher',
      prefix: config.label,
      logColor: 'cyan',
      isL1: config.isL1,
      order: config.order,
      bridgeContract: config.bridgeContract,
      dryMode: config.dryMode,
      stateUpdateAddress: config.stateUpdateAddress
    })
  }

  async pollHandler () {
    await this.checkTransfersCommittedFromDb()
  }

  async checkTransfersCommittedFromDb () {
    const dbTransferRoots = await this.db.transferRoots.getUnbondedTransferRoots()
    if (!dbTransferRoots.length) {
      return
    }

    this.logger.debug(
        `checking ${dbTransferRoots.length} unbonded transfer roots db items`
    )

    const promises: Array<Promise<any>> = []
    for (const dbTransferRoot of dbTransferRoots) {
      const {
        transferRootHash,
        totalAmount,
        destinationChainId,
        committedAt,
        sourceChainId,
        transferIds
      } = dbTransferRoot

      promises.push(this.checkTransfersCommitted(
        transferRootHash!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
        totalAmount!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
        destinationChainId!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
        committedAt!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
        sourceChainId!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
        transferIds! // eslint-disable-line @typescript-eslint/no-non-null-assertion
      ))
    }

    await Promise.all(promises)
  }

  checkTransfersCommitted = async (
    transferRootHash: string,
    totalAmount: BigNumber,
    destinationChainId: number,
    committedAt: number,
    sourceChainId: number,
    transferIds: string[]
  ) => {
    const logger = this.logger.create({ root: transferRootHash })

    const l1Bridge = this.bridge as L1Bridge
    const transferRootId = getTransferRootId(
      transferRootHash,
      totalAmount
    )

    const minDelaySec = await l1Bridge.getMinTransferRootBondDelaySeconds()
    const minDelayMs = minDelaySec * 1000
    const committedAtMs = committedAt * 1000
    const delta = Date.now() - committedAtMs - minDelayMs
    const shouldBond = delta > 0
    if (!shouldBond) {
      logger.debug(
        `transferRootHash ${transferRootHash} too early to bond. Must wait ${Math.abs(
          delta
        )} seconds`
      )
      return
    }

    const isBonded = await l1Bridge.isTransferRootIdBonded(transferRootId)
    if (isBonded) {
      logger.debug(
        `transferRootHash ${transferRootHash} already bonded. skipping.`
      )
      const event = await l1Bridge.getTransferRootBondedEvent(transferRootHash)
      if (!event) {
        throw new Error(`expected event object. transferRootHash: ${transferRootHash}`)
      }
      const { transactionHash } = event
      const { from: sender } = await l1Bridge.getTransaction(
        event.transactionHash
      )
      const timestamp = await this.bridge.getEventTimestamp(event)

      await this.db.transferRoots.update(transferRootHash, {
        transferRootHash,
        bonded: true,
        bonder: sender,
        bondTotalAmount: totalAmount,
        bondTxHash: transactionHash,
        bondedAt: timestamp,
        bondTransferRootId: transferRootId
      })
      return
    }

    logger.info(`source: ${sourceChainId} transferRootHash: ${transferRootHash}`)
    logger.debug('committedAt:', committedAt)
    logger.debug('destinationChainId:', destinationChainId)
    logger.debug('sourceChainId:', sourceChainId)
    logger.debug('transferRootHash:', transferRootHash)
    logger.debug('transferRootId:', transferRootId)
    logger.debug('totalAmount:', this.bridge.formatUnits(totalAmount))
    logger.debug('transferRootId:', transferRootId)

    const pendingTransfers: string[] = transferIds || []
    logger.debug('transferRootHash transferIds:', pendingTransfers)
    if (pendingTransfers.length > 0) {
      const tree = new MerkleTree(pendingTransfers)
      const rootHash = tree.getHexRoot()
      logger.debug('calculated transfer root hash:', rootHash)
      if (rootHash !== transferRootHash) {
        logger.error('calculated transfer root hash does not match')
        return
      }
    }

    const availableCredit = await l1Bridge.getBaseAvailableCredit()
    const bondAmount = await l1Bridge.getBondForTransferAmount(totalAmount)
    if (availableCredit.lt(bondAmount)) {
      const msg = `not enough credit to bond transferRoot. Have ${this.bridge.formatUnits(
          availableCredit
        )}, need ${this.bridge.formatUnits(bondAmount)}`
      logger.error(msg)
      this.notifier.error(msg)
      return
    }

    await this.handleStateSwitch()
    if (this.isDryOrPauseMode) {
      logger.warn(`dry: ${this.dryMode}, pause: ${this.pauseMode}. skipping bondTransferRoot`)
      return
    }

    logger.debug(
      `bonding transfer root ${transferRootHash} with destination chain ${destinationChainId}`
    )
    await this.db.transferRoots.update(transferRootHash, {
      sentBondTxAt: Date.now()
    })

    try {
      const tx = await l1Bridge.bondTransferRoot(
        transferRootHash,
        destinationChainId,
        totalAmount
      )
      const msg = `L1 bondTransferRoot dest ${destinationChainId}, tx ${tx.hash}`
      logger.info(msg)
      this.notifier.info(msg)
    } catch (err) {
      logger.error(err.message)
      throw err
    }
  }
}

export default BondTransferRootWatcher
