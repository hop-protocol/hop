import BlockDater from 'ethereum-block-by-date'
import EventEmitter from 'eventemitter3'
import { default as BaseWatcher, Event } from './BaseWatcher'
import { Chain } from '../models'
import { DateTime } from 'luxon'
import { transferSentTopic } from '../constants/eventTopics'

class L2ToL2Watcher extends BaseWatcher {
  public watch (): EventEmitter {
    this.start().catch((err: Error) => this.ee.emit('error', err))
    return this.ee
  }

  public async start () {
    await this.startBase()
    return this.poll(await this.pollFn())
  }

  public async pollFn (): Promise<any> {
    try {
      // here the await is intential so it's handled by the catch if it fails
      return await this.wrapperWatcher()
    } catch (err) {
      // console.error(err)
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
    l2Dest.on(filter, handleEvent)
    let tailBlock : number
    const batchBlocks = this.destinationChain === Chain.Polygon ? 500 : 1000
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

      if (!headBlock) {
        return false
      }
      const getRecentLogs = async (start: number, end: number): Promise<any[]> => {
        if (end > headBlock) {
          end = headBlock
          start = end - batchBlocks
        }
        if (end <= start) {
          return []
        }
        const events = (
          (await l2Dest.queryFilter(filter, start, end)) ?? []
        ).reverse()
        tailBlock = start + batchBlocks
        if (events.length) {
          return events
        }
        return getRecentLogs(tailBlock, end + batchBlocks)
      }
      const events = await getRecentLogs(tailBlock, tailBlock + batchBlocks)
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
    const amm = this.bridge.getAmm(this.destinationChain)
    const swap = await amm.getSaddleSwap()
    let startBlock = -1
    let endBlock = -1
    const filter = swap.filters.TokenSwap()
    const handleEvent = async (...args: any[]) => {
      const event = args[args.length - 1]
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
          if (await this.emitDestTxEvent(destTx)) {
            swap.off(filter, handleEvent)
            return true
          }
        }
      }
      return false
    }
    swap.on(filter, handleEvent)
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
      const events = (
        (await swap.queryFilter(filter, startBlock, endBlock)) ?? []
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
