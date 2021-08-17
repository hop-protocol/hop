import { default as BaseWatcher, Config, Event } from './BaseWatcher'
import { transferSentTopic } from './eventTopics'

class L2ToL1Watcher extends BaseWatcher {
  constructor (config: Config) {
    super(config)
  }

  public watch () {
    this.start().catch((err: Error) => this.ee.emit('error', err))
    return this.ee
  }

  public async start () {
    await this.startBase()
    return this.poll(await this.pollFn())
  }

  public async pollFn (): Promise<any> {
    const l1Bridge = await this.bridge.getL1Bridge()
    let transferHash: string = ''
    for (const log of this.sourceReceipt.logs) {
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
    const filter = l1Bridge.filters.WithdrawalBonded()
    const handleEvent = async (...args: any[]) => {
      const event = args[args.length - 1]
      if (event.topics[1] === transferHash) {
        const destTx = await event.getTransaction()
        if (await this.emitDestTxEvent(destTx)) {
          l1Bridge.off(filter, handleEvent)
          return true
        }
      }
      return false
    }
    l1Bridge.on(filter, handleEvent)
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
      const events = (
        (await l1Bridge.queryFilter(filter, startBlock, endBlock)) ?? []
      ).reverse()
      if (!events || !events.length) {
        return false
      }
      for (const event of events) {
        if (await handleEvent(event)) {
          return true
        }
      }
      return false
    }
  }
}

export default L2ToL1Watcher
