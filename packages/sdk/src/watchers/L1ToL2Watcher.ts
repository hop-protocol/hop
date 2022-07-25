import EventEmitter from 'eventemitter3'
import { default as BaseWatcher } from './BaseWatcher'
import { BigNumber } from 'ethers'
import { DateTime } from 'luxon'
import { EventNames } from '../constants'
import { makeRequest } from './makeRequest'
import {
  transferSentToL2Topic
} from '../constants/eventTopics'

class L1ToL2Watcher extends BaseWatcher {
  public watch (): EventEmitter {
    this.start().catch((err: Error) => this.ee.emit('error', err))
    return this.ee
  }

  public async start () {
    await this.startBase()
    return this.poll(await this.pollFn())
  }

  public async pollFn (): Promise<any> {
    const destWrapper = await this.bridge.getAmmWrapper(this.destinationChain)
    const l1Bridge = await this.bridge.getL1Bridge()
    const sourceTimestamp = this.sourceBlock.timestamp
    let attemptedSwap = false
    let amount = BigNumber.from(0)

    for (const log of this.sourceReceipt.logs) {
      if (log.topics[0] === transferSentToL2Topic) {
        const decodedLog = l1Bridge.interface.decodeEventLog(EventNames.TransferSentToL2, log.data)
        const amountOutMin = Number(decodedLog.amountOutMin.toString())
        const deadline = Number(decodedLog.deadline.toString())
        amount = decodedLog.amount
        attemptedSwap = deadline > 0 || amountOutMin > 0
      }
    }

    const recipient = this.sourceTx.from
    const handleDestTx = async (destTx: any, data: any = {}) => {
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
      const withinAnHour = 60 * 60
      if (destBlock.timestamp - sourceTimestamp < withinAnHour) {
        if (await this.emitDestTxEvent(destTx, data)) {
          return true
        }
      }
      return false
    }
    return async () => {
      const dateTime = DateTime.fromSeconds(this.sourceBlock.timestamp)
      const startTime = Math.floor(dateTime.minus({ hour: 1 }).toSeconds())
      const endTime = Math.floor(dateTime.plus({ hour: 24 }).toSeconds())
      const events = await getTransferFromL1CompletedEvents(this.destinationChain.slug, startTime, endTime)
      for (const event of events) {
        if (event.recipient.toLowerCase() === recipient.toLowerCase()) {
          if (event.amount.toString() === amount.toString()) {
            const destTx = await this.destinationChain.provider.getTransaction(event.transactionHash)
            console.log(destTx.hash)
            return handleDestTx(destTx)
          }
        }
      }
      return false
    }
  }
}

async function getTransferFromL1CompletedEvents (chain: string, startTime: number, endTime: number) {
  const query = `
    query TransferFromL1Completed($startTime: Int, $endTime: Int) {
      events: transferFromL1Completeds(
        where: {
          timestamp_gte: $startTime,
          timestamp_lte: $endTime
        },
        first: 1000,
        orderBy: timestamp,
        orderDirection: desc
      ) {
        recipient
        amount
        amountOutMin
        deadline
        transactionHash
        from
        timestamp
      }
    }
  `

  const data = await makeRequest(chain, query, {
    startTime,
    endTime
  })

  return data.events || []
}

export default L1ToL2Watcher
