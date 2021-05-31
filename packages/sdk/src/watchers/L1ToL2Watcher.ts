import { default as BaseWatcher, Config, Event } from './BaseWatcher'
import { Chain } from '../models'

const transferTopic =
  '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'

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
    const destWrapper = await this.bridge.getAmmWrapper(this.destinationChain)
    const l1Bridge = await this.bridge.getL1Bridge()
    const sourceTimestamp = this.sourceBlock.timestamp
    const decodedSource = l1Bridge.interface.decodeFunctionData(
      'sendToL2',
      this.sourceTx.data
    )
    const attemptedSwap = Number(decodedSource.deadline.toString()) > 0
    const amm = await this.bridge.getSaddleSwap(this.destinationChain)
    const ambBridge = await this.bridge.getAmbBridge(Chain.xDai)
    const ammFilter = amm.filters.TokenSwap()
    const ambFilter = {
      address: this.bridge.getL2HopBridgeTokenAddress(this.token, Chain.xDai)
    }
    let startBlock = -1
    let endBlock = -1
    const handleDestTx = async (destTx: any) => {
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
      if (destBlock.timestamp - sourceTimestamp < 500) {
        if (await this.emitDestTxEvent(destTx)) {
          amm.off(ammFilter, handleAmmEvent)
          ambBridge.off(ambFilter, handleAmmEvent)
          return true
        }
      }
      return false
    }
    const handleAmmEvent = async (...args: any[]) => {
      const event = args[args.length - 1]
      if (!event) {
        return false
      }
      if (!event.decode) {
        return false
      }
      const decodedLog = event.decode(event.data, event.topics)
      if (!decodedSource) {
        return false
      }
      if (destWrapper.address === decodedLog.buyer) {
        if (
          decodedSource.amount.toString() !== decodedLog.tokensSold.toString()
        ) {
          return
        }
        const destTx = await event.getTransaction()
        return handleDestTx(destTx)
      }
      return false
    }
    const handleAmbEvent = async (...args: any[]) => {
      const event = args[args.length - 1]
      if (!event) {
        return false
      }
      if (!event.getTransactionReceipt) {
        return false
      }
      const receipt = await event.getTransactionReceipt()
      for (const i in receipt.logs) {
        if (receipt.logs[i].topics[0] === transferTopic) {
          if (
            receipt.logs[i].topics[2].includes(
              this.sourceTx.from.toLowerCase().replace('0x', '')
            )
          ) {
            const destTx = await event.getTransaction()
            return handleDestTx(destTx)
          }
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
        startBlock = blockNumber - 1000
      } else {
        startBlock = endBlock
      }
      endBlock = blockNumber
      if (attemptedSwap) {
        amm.off(ammFilter, handleAmmEvent)
        amm.on(ammFilter, handleAmmEvent)
        const events = (
          (await amm.queryFilter(ammFilter, startBlock, endBlock)) ?? []
        ).reverse()
        if (!events || !events.length) {
          return false
        }
        for (const event of events) {
          if (await handleAmmEvent(event)) {
            return true
          }
        }
      } else if (this.destinationChain.equals(Chain.Polygon)) {
        console.log('TODO')
      } else if (this.destinationChain.equals(Chain.Optimism)) {
        console.log('TODO')
      } else if (this.destinationChain.equals(Chain.Arbitrum)) {
        console.log('TODO')
      } else if (this.destinationChain.equals(Chain.xDai)) {
        ambBridge.off(ambFilter, handleAmbEvent)
        ambBridge.on(ambFilter, handleAmbEvent)
        const events = (
          (await ambBridge.queryFilter(ambFilter, startBlock, endBlock)) ?? []
        ).reverse()
        if (!events || !events.length) {
          return false
        }
        for (const event of events) {
          if (await handleAmbEvent(event)) {
            return true
          }
        }
      }
      return false
    }
  }
}

export default L1ToL2Watcher
