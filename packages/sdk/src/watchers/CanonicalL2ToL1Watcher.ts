import { erc20Abi } from '@hop-protocol/abi'
import { Contract } from 'ethers'
import { default as BaseWatcher, Config, Event } from './BaseWatcher'
import { Chain } from '../models'
import CanonicalBridge from '../CanonicalBridge'

const tokensBridgedTopic =
  '0x9afd47907e25028cdaca89d193518c302bbb128617d5a992c5abd45815526593'

const tokenTransferTopic =
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
    return this.pollDestination(await this.pollFn())
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

  xDaiWatcher () {
    let startBlock = -1
    let endBlock = -1
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
      const canonicalBridge = new CanonicalBridge(
        this.network,
        this.signer,
        this.token,
        Chain.xDai
      )
      const ambBridge = await canonicalBridge.getAmbBridge(Chain.Ethereum)
      let recentLogs: any[] =
        (await ambBridge?.queryFilter(
          {
            address: canonicalBridge.getL1CanonicalTokenAddress(
              this.token,
              Chain.xDai
            )
          },
          startBlock,
          endBlock
        )) ?? []
      recentLogs = recentLogs.reverse()
      if (!recentLogs || !recentLogs.length) {
        return false
      }
      for (let item of recentLogs) {
        const receipt = await item.getTransactionReceipt()
        for (let i in receipt.logs) {
          if (receipt.logs[i].topics[0] === tokensBridgedTopic) {
            if (
              receipt.logs[i].topics[2].includes(
                this.sourceTx.from.toLowerCase().replace('0x', '')
              )
            ) {
              const destTx = await item.getTransaction()
              if (!destTx) {
                continue
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
              return true
            }
          }
        }
      }
      return false
    }
  }

  private async polygonWatcher () {
    let startBlock = -1
    let endBlock = -1
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
      const tokenAddress = this.getL1CanonicalTokenAddress(
        this.token,
        Chain.Ethereum
      )
      const contract = new Contract(
        tokenAddress,
        erc20Abi,
        await this.getSignerOrProvider(Chain.Ethereum)
      )
      let recentLogs: any[] =
        (await contract?.queryFilter(
          {
            topics: []
          },
          startBlock,
          endBlock
        )) ?? []
      recentLogs = recentLogs.reverse()
      if (!recentLogs || !recentLogs.length) {
        return false
      }
      for (let item of recentLogs) {
        const receipt = await item.getTransactionReceipt()
        for (let i in receipt.logs) {
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

              const destTx = await item.getTransaction()
              if (!destTx) {
                continue
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
              return true
            }
          }
        }
      }
      return false
    }
  }
}

export default L1ToL2Watcher
