import BlockDater from 'ethereum-block-by-date'
import { default as BaseWatcher } from './BaseWatcher'
import { BigNumber, providers } from 'ethers'
import { Chain } from '../models'
import { DateTime } from 'luxon'
import { EventNames, NetworkSlug } from '../constants'
import {
  tokenTransferTopic,
  transferFromL1CompletedTopic,
  transferSentToL2Topic
} from '../constants/eventTopics'

class L1ToL2Watcher extends BaseWatcher {
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

    const amm = this.bridge.getAmm(this.destinationChain)
    const swap = await amm.getSaddleSwap()
    const ambBridge = await this.bridge.getAmbBridge(Chain.Gnosis)
    const ammFilter = swap.filters.TokenSwap()
    const ambFilter = {
      address: this.bridge.getL2HopBridgeTokenAddress(this.token, Chain.Gnosis)
    }
    const l2BridgeReceiveFilter = {
      topics: [transferFromL1CompletedTopic]
    }
    const hToken = await this.bridge
      .getL2HopToken(this.destinationChain)
      .getErc20()
    const token = await this.bridge
      .getCanonicalToken(this.destinationChain)
      .getErc20()
    const hTokenFilter = 'Transfer'
    const tokenFilter = 'Transfer'
    const recipient = this.sourceTx.from
    const batchBlocks = 1000
    let startBlock = -1
    let endBlock = -1
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
          swap.off(ammFilter, handleAmmEvent)
          ambBridge.off(ambFilter, handleAmmEvent)
          hToken.off(hTokenFilter, handleHTokenEvent)
          token.off(tokenFilter, handleTokenEvent)
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
      if (
        destWrapper.address.toLowerCase() === decodedLog.buyer.toLowerCase()
      ) {
        if (amount.toString() !== decodedLog.tokensSold.toString()) {
          return
        }
        // const destTx = await event.getTransaction()
        // return handleDestTx(destTx)
      }
      return false
    }
    const handleTokenEvent = async (...args: any[]) => {
      const event = args[args.length - 1]
      if (!event) {
        return false
      }
      const decodedLog = event.decode(event.data, event.topics)
      if (decodedLog.from !== destWrapper.address) {
        return
      }
      if (decodedLog.to !== recipient) {
        return
      }
      console.log('token decoded log', decodedLog)
      const destTx = await event.getTransaction()
      return handleDestTx(destTx)
    }
    const handleHTokenEvent = async (...args: any[]) => {
      const event = args[args.length - 1]
      if (!event) {
        return false
      }
      const decodedLog = event.decode(event.data, event.topics)
      if (decodedLog.from !== destWrapper.address) {
        return
      }
      if (decodedLog.to !== recipient) {
        return
      }
      console.log('hToken decoded log', decodedLog)
      const destTx = await event.getTransaction()
      return handleDestTx(destTx, {
        isHTokenTransfer: true
      })
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
        if (receipt.logs[i].topics[0] === tokenTransferTopic) {
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
    let startBlockNumber: number = -1
    return async () => {
      if (startBlockNumber === -1) {
        const blockDater = new BlockDater(this.destinationChain.provider)
        const date = DateTime.fromSeconds(this.sourceBlock.timestamp).toJSDate()
        const info = await blockDater.getDate(date)
        if (!info) {
          return false
        }
        startBlockNumber = info.block
      }
      if (startBlock === -1) {
        startBlock = startBlockNumber
        endBlock = startBlock + batchBlocks
      } else {
        startBlock = startBlock + batchBlocks
        endBlock = startBlock + batchBlocks
      }
      if (attemptedSwap) {
        swap.off(ammFilter, handleAmmEvent)
        swap.on(ammFilter, handleAmmEvent)

        hToken.off(hTokenFilter, handleHTokenEvent)
        hToken.on(hTokenFilter, handleHTokenEvent)

        token.off(tokenFilter, handleTokenEvent)
        token.on(tokenFilter, handleTokenEvent)
        const events = (
          (await swap.queryFilter(ammFilter, startBlock, endBlock)) ?? []
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
        const handleL2BridgeReceiveEvent = async (...args: any[]) => {
          const event = args[args.length - 1]
          if (event.args.recipient.toLowerCase() === recipient.toLowerCase()) {
            if (event.args.amount.toString() === amount.toString()) {
              const destTx = await event.getTransaction()
              return handleDestTx(destTx)
            }
          }
          return false
        }

        let provider = this.destinationChain.provider
        let url: string
        // archive node provider is needed to read bridge events triggered
        // by matic validators.
        if (
          this.network === NetworkSlug.Mainnet ||
          this.network === NetworkSlug.Staging
        ) {
          url = 'https://matic-mainnet-archive-rpc.bwarelabs.com'
        } else if (this.network === NetworkSlug.Goerli) {
          url = 'https://matic-testnet-archive-rpc.bwarelabs.com'
        }
        if (url) {
          provider = new providers.StaticJsonRpcProvider(url)
        }

        const l2Bridge = await this.bridge.getL2Bridge(Chain.Polygon, provider)
        l2Bridge.off(l2BridgeReceiveFilter, handleL2BridgeReceiveEvent)
        l2Bridge.on(l2BridgeReceiveFilter, handleL2BridgeReceiveEvent)
        const events = (
          (await l2Bridge.queryFilter(
            l2BridgeReceiveFilter,
            startBlock,
            endBlock
          )) ?? []
        ).reverse()
        if (!events || !events.length) {
          return false
        }
        for (const event of events) {
          if (await handleL2BridgeReceiveEvent(event)) {
            return true
          }
        }
      } else if (this.destinationChain.equals(Chain.Optimism)) {
        throw new Error('not implemented')
      } else if (this.destinationChain.equals(Chain.Arbitrum)) {
        throw new Error('not implemented')
      } else if (this.destinationChain.equals(Chain.Gnosis)) {
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
