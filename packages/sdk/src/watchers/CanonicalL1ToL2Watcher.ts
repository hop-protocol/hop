import { default as BaseWatcher, Config, Event } from './BaseWatcher'
import { Chain } from '../models'
import CanonicalBridge from '../CanonicalBridge'
import { tokensBridgedTopic, tokenTransferTopic } from './eventTopics'

class L1ToL2Watcher extends BaseWatcher {
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
    if (this.destinationChain.equals(Chain.xDai)) {
      return this.xDaiWatcher()
    } else if (this.destinationChain.equals(Chain.Optimism)) {
      throw new Error('not implemented')
    } else if (this.destinationChain.equals(Chain.Polygon)) {
      return this.polygonWatcher()
    } else {
      throw new Error('not implemented')
    }
  }

  private async xDaiWatcher () {
    let startBlock = -1
    let endBlock = -1
    const canonicalBridge = new CanonicalBridge(
      this.network,
      this.signer,
      this.token,
      Chain.xDai
    )
    const ambBridge = await canonicalBridge.getAmbBridge(Chain.xDai)
    const filter = {
      address: this.getL2CanonicalTokenAddress(this.token, Chain.xDai)
    }
    const handleEvent = async (...args: any[]) => {
      const event = args[args.length - 1]
      const receipt = await event.getTransactionReceipt()
      for (const i in receipt.logs) {
        if (receipt.logs[i].topics[0] === tokensBridgedTopic) {
          if (
            receipt.logs[i].topics[2].includes(
              this.sourceTx.from.toLowerCase().replace('0x', '')
            )
          ) {
            const destTx = await event.getTransaction()
            if (await this.emitDestTxEvent(destTx)) {
              ambBridge.off(filter, handleEvent)
              return true
            }
          }
        }
      }
      return false
    }
    ambBridge.on(filter, handleEvent)
    return async () => {
      const blockNumber = await this.destinationChain.provider.getBlockNumber()
      if (!blockNumber) {
        return false
      }
      if (startBlock === -1) {
        startBlock = endBlock - 1000
      } else {
        startBlock = endBlock
      }
      endBlock = blockNumber
      const events = (
        (await ambBridge.queryFilter(filter, startBlock, endBlock)) ?? []
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

  private async polygonWatcher () {
    let startBlock = -1
    let endBlock = -1
    const canonicalBridge = new CanonicalBridge(
      this.network,
      this.signer,
      this.token,
      Chain.Polygon
    )
    const tokenBridge = await canonicalBridge.getL2CanonicalBridge()
    const filter = {
      address: canonicalBridge.getL2CanonicalTokenAddress(
        this.token,
        Chain.Polygon
      )
    }
    const handleEvent = async (...args: any[]) => {
      const event = args[args.length - 1]
      const receipt = await event.getTransactionReceipt()
      for (const i in receipt.logs) {
        if (receipt.logs[i].topics[0] === tokenTransferTopic) {
          if (
            receipt.logs[i].topics[2].includes(
              this.sourceTx.from.toLowerCase().replace('0x', '')
            )
          ) {
            const destTx = await event.getTransaction()
            if (await this.emitDestTxEvent(destTx)) {
              tokenBridge.off(filter, handleEvent)
              continue
            }
            return true
          }
        }
      }
      return false
    }
    tokenBridge.on(filter, handleEvent)
    return async () => {
      const blockNumber = await this.destinationChain.provider.getBlockNumber()
      if (!blockNumber) {
        return false
      }
      if (startBlock === -1) {
        startBlock = endBlock - 1000
      } else {
        startBlock = endBlock
      }
      endBlock = blockNumber
      const events = (
        (await tokenBridge.queryFilter(filter, startBlock, endBlock)) ?? []
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

export default L1ToL2Watcher
