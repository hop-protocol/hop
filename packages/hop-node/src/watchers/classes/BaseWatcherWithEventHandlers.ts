import { Contract, BigNumber } from 'ethers'
import BaseWatcher from './BaseWatcher'
import db from 'src/db'
import L2Bridge from './L2Bridge'
import chalk from 'chalk'

interface Config {
  tag: string
  prefix?: string
  logColor?: string
  order?: () => number
  isL1?: boolean
  bridgeContract?: Contract
  dryMode?: boolean
}

class BaseWatcherWithEventHandlers extends BaseWatcher {
  constructor (config: Config) {
    super(config)
  }

  public handleTransferSentEvent = async (
    transferId: string,
    recipient: string,
    amount: BigNumber,
    transferNonce: string,
    bonderFee: BigNumber,
    index: string,
    amountOutMin: BigNumber,
    deadline: BigNumber,
    meta: any
  ) => {
    const logger = this.logger.create({ id: transferId })
    try {
      const dbTransfer = await db.transfers.getByTransferId(transferId)
      if (dbTransfer?.withdrawalBonded) {
        return
      }
      if (dbTransfer?.sourceChainId) {
        //return
      }

      logger.debug(`received TransferSent event`)
      logger.debug('transfer event amount:', this.bridge.formatUnits(amount))
      logger.debug('transferId:', chalk.bgCyan.black(transferId))

      const { transactionHash, blockNumber } = meta
      await this.bridge.waitSafeConfirmations()
      const sentTimestamp = await this.bridge.getBlockTimestamp(blockNumber)
      const { data } = await this.bridge.getTransaction(transactionHash)

      const l2Bridge = this.bridge as L2Bridge
      const { chainId } = await l2Bridge.decodeSendData(data)
      const sourceChainId = await l2Bridge.getChainId()
      await db.transfers.update(transferId, {
        transferId,
        chainId,
        sourceChainId,
        recipient,
        amount,
        transferNonce,
        bonderFee,
        amountOutMin,
        deadline: Number(deadline.toString()),
        sentTxHash: transactionHash,
        sentBlockNumber: blockNumber,
        sentTimestamp: sentTimestamp
      })
    } catch (err) {
      if (err.message !== 'cancelled') {
        logger.error(`handleTransferSentEvent error: ${err.message}`)
        this.notifier.error(`handleTransferSentEvent error: ${err.message}`)
      }
    }
  }
}

export default BaseWatcherWithEventHandlers
