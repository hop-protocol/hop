import BlockDater from 'ethereum-block-by-date'
import { default as BaseWatcher } from './BaseWatcher'
import { DateTime } from 'luxon'
import { transferSentTopic } from '../constants/eventTopics'

class L2ToL1Watcher extends BaseWatcher {
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
    let startBlock : number
    let endBlock : number
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
    let tailBlock : number
    const batchBlocks = 1000
    return async () => {
      let headBlock = this.options?.destinationHeadBlockNumber
      if (!headBlock) {
        headBlock = await this.destinationChain.provider.getBlockNumber()
      }
      if (!tailBlock) {
        const blockDater = new BlockDater(this.destinationChain.provider)
        const date = DateTime.fromSeconds(this.sourceBlock.timestamp - (60 * 60)).toJSDate()
        const info = await blockDater.getDate(date)
        if (info) {
          tailBlock = info.block
        }
      }

      if (!startBlock) {
        startBlock = tailBlock
        endBlock = startBlock + batchBlocks
      }

      if (!headBlock) {
        return false
      }

      const events = (
        (await l1Bridge.queryFilter(filter, startBlock, endBlock)) ?? []
      ).reverse()

      startBlock = startBlock + batchBlocks
      endBlock = endBlock + batchBlocks

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
