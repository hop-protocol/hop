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

class L2ToL1Watcher extends BaseWatcher {
  constructor (config: Config) {
    super(config)
  }

  public async start () {
    await this.startBase()
    const pollFn = await this.startDestinationWatcher()
    return this.pollDestination(pollFn)
  }

  public async startDestinationWatcher (): Promise<any> {
    const wrapper = await this.bridge.getAmmWrapper(this.sourceChain)
    const l1Bridge = await this.bridge.getL1Bridge()
    let decodedSource: any
    let attemptedSwap = false
    try {
      decodedSource = wrapper?.interface.decodeFunctionData(
        'swapAndSend',
        this.sourceTx.data
      )
      attemptedSwap = true
    } catch (err) {
      const l2Bridge = await this.bridge.getL2Bridge(this.sourceChain)
      decodedSource = l2Bridge?.interface.decodeFunctionData(
        'send',
        this.sourceTx.data
      )
    }
    let transferHash: string = ''
    for (let log of this.sourceReceipt.logs) {
      if (log.topics[0] === transferSentTopic) {
        transferHash = log.topics[1]
      }
    }
    if (!transferHash) {
      return false
    }
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
      let recentLogs: any[] =
        (await l1Bridge?.queryFilter(
          l1Bridge.filters.WithdrawalBonded(),
          startBlock,
          endBlock
        )) ?? []
      recentLogs = recentLogs.reverse()
      if (!recentLogs || !recentLogs.length) {
        return false
      }
      for (let item of recentLogs) {
        if (item.topics[1] === transferHash) {
          const destTx = await item.getTransaction()
          if (!destTx) {
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
      }
      return false
    }
  }

  public watch () {
    this.start().catch((err: Error) => this.ee.emit('error', err))
    return this.ee
  }
}

export default L2ToL1Watcher
