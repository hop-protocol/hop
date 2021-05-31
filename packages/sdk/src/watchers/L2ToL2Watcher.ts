import { default as BaseWatcher, Config, Event } from './BaseWatcher'

const transferSentTopic =
  '0x5a4dabefa20e4685729030de2db148bc227da9d371286964568fbfafe29ae1b2'

class L2ToL2Watcher extends BaseWatcher {
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
    try {
      // here the await is intential so it's handled by the catch if it fails
      return await this.wrapperWatcher()
    } catch (err) {
      console.log(err)
      return this.ammWatcher()
    }
  }

  private async wrapperWatcher () {
    const l2Dest = await this.bridge.getL2Bridge(this.destinationChain)
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
    const filter = l2Dest.filters.WithdrawalBonded()
    const handleEvent = async (...args: any[]) => {
      const event = args[args.length - 1]
      const decodedLog = event.decode(event.data, event.topics)
      if (transferHash === decodedLog.transferId) {
        if (!this.sourceBlock.timestamp) {
          return false
        }
        const destTx = await event.getTransaction()
        if (!destTx) {
          return false
        }
        const destBlock = await this.destinationChain.provider.getBlock(
          destTx.blockNumber
        )
        if (!destBlock) {
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
        l2Dest.off(filter, handleEvent)
        return true
      }
      return false
    }
    return async () => {
      const headBlock =
        this.options?.destinationHeadBlockNumber ||
        (await this.destinationChain.provider.getBlockNumber())
      if (!headBlock) {
        return false
      }
      const tailBlock = headBlock - 10000
      const getRecentLogs = async (head: number): Promise<any[]> => {
        if (head < tailBlock) {
          return []
        }
        const start = head - 1000
        const end = head
        l2Dest.off(filter, handleEvent)
        l2Dest.on(filter, handleEvent)
        const events = (
          (await l2Dest.queryFilter(filter, start, end)) ?? []
        ).reverse()
        if (events.length) {
          return events
        }
        return getRecentLogs(start)
      }
      const events = await getRecentLogs(headBlock)
      for (const event of events) {
        if (await handleEvent(event)) {
          return true
        }
      }
      return false
    }
  }

  private async ammWatcher () {
    // events for token swap on L2 (ie saddle convert page on UI)
    const amm = await this.bridge.getSaddleSwap(this.destinationChain)
    let startBlock = -1
    let endBlock = -1
    const filter = amm.filters.TokenSwap()

    const handleEvent = async (...args: any[]) => {
      const event = args[args.length - 1]
      console.log('amm ev', event)
      const decodedLog = event.decode(event.data, event.topics)
      if (this.sourceTx.from === decodedLog.buyer) {
        if (!this.sourceBlock.timestamp) {
          return false
        }
        const destTx = await event.getTransaction()
        if (!destTx) {
          return false
        }
        const destBlock = await this.destinationChain.provider.getBlock(
          destTx.blockNumber
        )
        if (!destBlock) {
          return false
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
          amm.off(filter, handleEvent)
          return true
        }
      }
      return false
    }

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
      amm.off(filter, handleEvent)
      amm.on(filter, handleEvent)
      const events = (
        (await amm.queryFilter(filter, startBlock, endBlock)) ?? []
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

export default L2ToL2Watcher
