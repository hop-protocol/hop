import {
  default as BaseWatcher,
  Config,
  WatchOptions,
  Event
} from './BaseWatcher'
import { TChain, TToken, TProvider } from '../types'
import { Chain } from '../models'

const transferSentTopic =
  '0x5a4dabefa20e4685729030de2db148bc227da9d371286964568fbfafe29ae1b2'

class L2ToL2Watcher extends BaseWatcher {
  constructor (config: Config) {
    super(config)
  }

  public async start () {
    await this.startBase()
    const pollFn = await this.startDestinationWatcher()
    return this.pollDestination(pollFn)
  }

  public async startDestinationWatcher (): Promise<any> {
    try {
      const wrapperSource = await this.bridge.getAmmWrapper(this.sourceChain)
      const wrapperDest = await this.bridge.getAmmWrapper(this.destinationChain)
      const l2Dest = await this.bridge.getL2Bridge(this.destinationChain)
      const exchange = await this.bridge.getSaddleSwap(this.destinationChain)
      const decodedSource = wrapperSource?.interface.decodeFunctionData(
        'swapAndSend',
        this.sourceTx.data
      )
      let transferHash: string = ''
      for (let log of this.sourceReceipt.logs) {
        if (log.topics[0] === transferSentTopic) {
          transferHash = log.topics[1]
          break
        }
      }
      if (!transferHash) {
        return false
      }
      let startBlock = -1
      let endBlock = -1
      return async () => {
        let headBlock =
          this.options?.destinationHeadBlockNumber ||
          (await this.destinationChain.provider.getBlockNumber())
        if (!headBlock) {
          return false
        }
        let tailBlock = headBlock - 10000
        const getRecentLogs = async (head: number): Promise<any[]> => {
          if (head < tailBlock) {
            return []
          }
          const start = head - 1000
          const end = head
          let recentLogs: any[] =
            (await l2Dest?.queryFilter(
              l2Dest.filters.WithdrawalBonded(),
              start,
              end
            )) ?? []
          recentLogs = recentLogs.reverse()
          if (recentLogs.length) {
            return recentLogs
          }
          return getRecentLogs(start)
        }
        let recentLogs = await getRecentLogs(headBlock)
        for (let item of recentLogs) {
          const decodedLog = item.decode(item.data, item.topics)
          if (transferHash === decodedLog.transferId) {
            if (!this.sourceBlock.timestamp) {
              continue
            }
            const destTx = await item.getTransaction()
            if (!destTx) {
              continue
            }
            const destBlock = await this.destinationChain.provider.getBlock(
              destTx.blockNumber
            )
            if (!destBlock) {
              continue
            }
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
          return false
        }
        return false
      }
    } catch (err) {
      console.log(err)
      // events for token swap on L2 (ie saddle convert page on UI)
      const exchange = await this.bridge.getSaddleSwap(this.destinationChain)
      let startBlock = -1
      let endBlock = -1
      return async () => {
        const blockNumber = await this.destinationChain.provider.getBlockNumber()
        if (!blockNumber) {
          return false
        }
        if (startBlock === -1) {
          startBlock = endBlock - 100
        } else {
          startBlock = endBlock
        }
        endBlock = blockNumber
        let recentLogs: any[] =
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
          if (this.sourceTx.from === decodedLog.buyer) {
            if (!this.sourceBlock.timestamp) {
              continue
            }
            const destTx = await item.getTransaction()
            if (!destTx) {
              continue
            }
            const destBlock = await this.destinationChain.provider.getBlock(
              destTx.blockNumber
            )
            if (!destBlock) {
              continue
            }
            if (destBlock.timestamp - this.sourceBlock.timestamp < 500) {
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
          return false
        }
        return false
      }
    }
  }

  public watch () {
    this.start().catch((err: Error) => this.ee.emit('error', err))
    return this.ee
  }
}

export default L2ToL2Watcher
