import EventEmitter from 'eventemitter3'
import fetch from 'isomorphic-fetch'
import { default as BaseWatcher } from './BaseWatcher'
import { BigNumber } from 'ethers'
import { DateTime } from 'luxon'
import { EventNames } from '../constants'
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
    let tailBlock : number
    return async () => {
      const dateTime = DateTime.fromSeconds(this.sourceBlock.timestamp)
      const startTime = Math.floor(dateTime.minus({ hour: 1 }).toSeconds())
      const endTime = Math.floor(dateTime.plus({ hour: 24 }).toSeconds())
      const events = await getL2Events(this.destinationChain.slug, startTime, endTime)
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

async function makeQuery (url: string, query: string, variables?: any) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      query,
      variables: variables || {}
    })
  })
  const jsonRes = await res.json()
  if (jsonRes.errors) {
    throw new Error(jsonRes.errors[0].message)
  }
  return jsonRes.data
}

function getUrl (chain: string) {
  if (chain === 'gnosis') {
    chain = 'xdai'
  }

  if (chain === 'mainnet') {
    // return 'https://gateway.thegraph.com/api/bd5bd4881b83e6c2c93d8dc80c9105ba/subgraphs/id/Cjv3tykF4wnd6m9TRmQV7weiLjizDnhyt6x2tTJB42Cy'
  }

  return `https://api.thegraph.com/subgraphs/name/hop-protocol/hop-${chain}`
}

async function getL2Events (chain: string, startTime: number, endTime: number) {
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

  const url = getUrl(chain)
  const data = await makeQuery(url, query, {
    startTime,
    endTime
  })

  return data.events || []
}

export default L1ToL2Watcher
