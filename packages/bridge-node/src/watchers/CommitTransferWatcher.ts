import '../moduleAlias'
import assert from 'assert'
import chalk from 'chalk'
import { wait } from 'src/utils'
import { throttle } from 'src/utils'
import BaseWatcher from 'src/watchers/BaseWatcher'

export interface Config {
  l2BridgeContract: any
  label: string
  order?: () => number
}

class CommitTransfersWatcher extends BaseWatcher {
  l2BridgeContract: any
  label: string

  constructor (config: Config) {
    super({
      label: 'commitTransferWatcher',
      logColor: 'yellow',
      order: config.order
    })
    this.l2BridgeContract = config.l2BridgeContract
    this.label = config.label
  }

  async start () {
    this.started = true
    this.logger.log(`starting L2 ${this.label} commitTransfers scheduler`)
    try {
      await this.watch()
    } catch (err) {
      this.logger.error('watcher error:', err)
    }
  }

  async stop () {
    this.l2BridgeContract.off(
      this.l2BridgeContract.filters.TransferSent(),
      this.handleTransferSentEvent
    )
    this.started = false
  }

  sendTx = async (chainId: string) => {
    return this.l2BridgeContract.commitTransfers(chainId)
  }

  check = throttle(async (chainId: string) => {
    if (!chainId) {
      throw new Error('chainId is required')
    }
    const pendingAmount = Number(
      (await this.l2BridgeContract.pendingAmountForChainId(chainId)).toString()
    )
    if (pendingAmount <= 0) {
      return
    }

    const tx = await this.sendTx(chainId)
    tx?.wait().then(() => {
      this.emit('commitTransfers', {})
    })
    this.logger.log(
      `L2 ${this.label} commitTransfers tx:`,
      chalk.bgYellow.black.bold(tx.hash)
    )
    const receipt = await tx.wait()
    assert(receipt.status === 1)
  }, 15 * 1000)

  handleTransferSentEvent = async (
    transferHash: string,
    recipient: string,
    amount: string,
    transferNonce: string,
    relayerFee: string,
    meta: any
  ) => {
    try {
      this.logger.log(`${this.label} received TransferSent event`)
      this.logger.log(`${this.label} waiting`)
      await wait(20 * 1000)
      const { transactionHash } = meta
      const {
        from: sender,
        data
      } = await this.l2BridgeContract.provider.getTransaction(transactionHash)

      let chainId = ''
      try {
        const decoded = await this.l2BridgeContract.interface.decodeFunctionData(
          'swapAndSend',
          data
        )
        chainId = decoded.chainId.toString()
      } catch (err) {
        const decoded = await this.l2BridgeContract.interface.decodeFunctionData(
          'send',
          data
        )
        chainId = decoded.chainId.toString()
      }

      await this.check(chainId)
    } catch (err) {
      if (err.message !== 'cancelled') {
        this.logger.error('commitTransfers tx error:', err.message)
      }
    }
  }

  async watch () {
    this.l2BridgeContract
      .on(
        this.l2BridgeContract.filters.TransferSent(),
        this.handleTransferSentEvent
      )
      .on('error', err => {
        this.logger.error('event watcher error:', err.message)
      })
  }
}

export default CommitTransfersWatcher
