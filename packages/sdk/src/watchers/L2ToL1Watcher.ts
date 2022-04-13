import { default as BaseWatcher } from './BaseWatcher'
import { makeRequest } from './makeRequest'
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
    return async () => {
      let transferId = ''
      for (const log of this.sourceReceipt.logs) {
        if (log.topics[0] === transferSentTopic) {
          transferId = log.topics[1]
        }
      }
      if (!transferId) {
        return
      }
      const events = await getWithdrawalBondedEvents(this.destinationChain.slug, transferId)
      if (events.length) {
        const event = events[0]
        const destTx = await this.destinationChain.provider.getTransaction(event.transactionHash)
        return this.emitDestTxEvent(destTx)
      }
      return false
    }
  }
}

async function getWithdrawalBondedEvents (chain: string, transferId: string) {
  const query = `
    query WithdrawalBonded($transferId: String) {
      events: withdrawalBondeds(
        where: {
          transferId: $transferId
        }
      ) {
        transferId
        transactionHash
        timestamp
        token
        from
      }
    }
  `

  const data = await makeRequest(chain, query, {
    transferId
  })

  return data.events || []
}

export default L2ToL1Watcher
