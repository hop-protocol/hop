import {
  default as BaseWatcher,
  Config,
  WatchOptions,
  Event
} from './BaseWatcher'
import { TChain, TToken, TProvider } from '../types'
import { Chain } from '../models'

class L1ToL2Watcher extends BaseWatcher {
  constructor (config: Config) {
    super(config)
  }

  public watch () {
    this.start().catch((err: Error) => this.ee.emit('error', err))
    return this.ee
  }

  public async start () {
    await this.startBase()
    return this.pollDestination(await this.pollFn())
  }

  public async pollFn (): Promise<any> {
    const destWrapper = await this.bridge.getAmmWrapper(this.destinationChain)
    const l1Bridge = await this.bridge.getL1Bridge()
    const sourceTimestamp = this.sourceBlock.timestamp
    const decodedSource = l1Bridge?.interface.decodeFunctionData(
      'sendToL2',
      this.sourceTx.data
    )

    let attemptedSwap = Number(decodedSource.deadline.toString()) > 0
    //const chainId = decodedSource?.chainId
    const l2Bridge = await this.bridge.getL2Bridge(this.destinationChain)
    const exchange = await this.bridge.getSaddleSwap(this.destinationChain)
    let destTx: any
    let startBlock = -1
    let endBlock = -1
    return async () => {
      const blockNumber = await this.destinationChain.provider.getBlockNumber()
      if (!blockNumber) {
        return false
      }
      if (startBlock === -1) {
        startBlock = blockNumber - 1000
      } else {
        startBlock = endBlock
      }
      endBlock = blockNumber
      let recentLogs: any[]
      if (attemptedSwap) {
        recentLogs =
          (await exchange?.queryFilter(
            exchange.filters.TokenSwap(),
            startBlock,
            endBlock
          )) ?? []
        recentLogs = recentLogs.reverse()
        if (!recentLogs || !recentLogs.length) {
          return false
        }
        for (let item of recentLogs) {
          const decodedLog = item.decode(item.data, item.topics)
          if (destWrapper.address === decodedLog.buyer) {
            if (
              decodedSource?.amount.toString() !==
              decodedLog.tokensSold.toString()
            ) {
              continue
            }
            destTx = await item.getTransaction()
          }
        }
      } else if (this.destinationChain.equals(Chain.xDai)) {
        const ambBridge = await this.bridge.getAmbBridge(Chain.xDai)
        recentLogs =
          (await ambBridge?.queryFilter(
            {
              address: this.bridge.getL2HopBridgeTokenAddress(
                this.token,
                Chain.xDai
              )
            },
            startBlock,
            endBlock
          )) ?? []
        recentLogs = recentLogs.reverse()
        if (!recentLogs || !recentLogs.length) {
          return false
        }

        for (let item of recentLogs) {
          const receipt = await item.getTransactionReceipt()
          for (let i in receipt.logs) {
            const transferTopic =
              '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
            if (receipt.logs[i].topics[0] === transferTopic) {
              if (
                receipt.logs[i].topics[2].includes(
                  this.sourceTx.from.toLowerCase().replace('0x', '')
                )
              ) {
                destTx = await item.getTransaction()
              }
            }
          }
        }
      }
      if (!sourceTimestamp) {
        return false
      }
      if (!destTx) {
        return false
      }
      const destBlock = await this.destinationChain.provider.getBlock(
        destTx.blockNumber
      )
      if (!destBlock) {
        return false
      }
      if (destBlock.timestamp - sourceTimestamp < 500) {
        const destTxReceipt = await this.destinationChain.provider.waitForTransaction(
          destTx.hash
        )
        this.ee.emit(Event.Receipt, {
          chain: this.destinationChain,
          receipt: destTxReceipt
        })
        this.ee.emit(Event.DestinationTxReceipt, {
          chain: this.destinationChain,
          receipt: destTxReceipt
        })
        return true
      }
    }
  }
}

export default L1ToL2Watcher
