import { default as BaseWatcher, Config, Event } from './BaseWatcher'

const transferSentTopic =
  '0x5a4dabefa20e4685729030de2db148bc227da9d371286964568fbfafe29ae1b2'

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
    return this.pollDestination(await this.pollFn())
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
        if (!destTx) {
          return false
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
        l1Bridge.off(filter, handleEvent)
        l1Bridge.on(filter, handleEvent)
        return true
      }
    }

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
      l1Bridge.off(filter, handleEvent)
      l1Bridge.on(filter, handleEvent)
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
