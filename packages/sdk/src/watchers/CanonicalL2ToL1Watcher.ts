import { erc20Abi } from '@hop-protocol/core/abi'
import { Contract } from 'ethers'
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
    if (this.sourceChain.equals(Chain.xDai)) {
      return this.xDaiWatcher()
    } else if (this.sourceChain.equals(Chain.Polygon)) {
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
    const ambBridge = await canonicalBridge.getAmbBridge(Chain.Ethereum)
    const filter = {
      address: canonicalBridge.getL1CanonicalTokenAddress(
        this.token,
        Chain.xDai
      )
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
    const tokenAddress = this.getL1CanonicalTokenAddress(
      this.token,
      Chain.Ethereum
    )
    const contract = new Contract(
      tokenAddress,
      erc20Abi,
      await this.getSignerOrProvider(Chain.Ethereum)
    )
    const filter: any = {
      topics: []
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
            if (
              !receipt.logs[i].topics[1].includes(
                this.getL1PosErc20PredicateAddress(this.token, Chain.Polygon)
                  .toLowerCase()
                  .replace('0x', '')
              )
            ) {
              continue
            }

            const destTx = await event.getTransaction()
            if (await this.emitDestTxEvent(destTx)) {
              contract.off(filter, handleEvent)
              return true
            }
          }
        }
      }
      return false
    }
    contract.on(filter, handleEvent)
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
        (await contract.queryFilter(filter, startBlock, endBlock)) ?? []
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
