import EventEmitter from 'eventemitter3'
import { Signer } from 'ethers'
import { Chain, Token } from './models'
import { wait } from './utils'
import HopBridge from './HopBridge'
import CanonicalBridge from './CanonicalBridge'
import { TChain } from './types'
import Base from './Base'
import _version from './version'

enum Event {
  Receipt = 'receipt',
  SourceTxReceipt = 'sourceTxReceipt',
  DestinationTxReceipt = 'destinationTxReceipt'
}

/**
 * Class reprensenting Hop
 * @namespace Hop
 */
class Hop extends Base {
  public signer: Signer

  static Event = Event
  static Chain = Chain
  static Token = Token

  Event = Event
  Chain = Chain
  Token = Token

  /**
   * @desc Instantiates Hop SDK.
   * Returns a new Hop SDK instance.
   * @param {Object} signer - Ethers `Signer` for signing transactions.
   * @example
   *```js
   *import { Hop } from '@hop-protocol/sdk'
   *
   *const hop = new Hop(signer)
   *```
   * @example
   *```js
   *import { Hop } from '@hop-protocol/sdk'
   *import { Wallet } from 'ethers'
   *
   *const signer = new Wallet(privateKey)
   *const hop = new Hop(signer)
   *```
   */
  constructor (signer?: Signer) {
    super()
    if (signer) {
      this.signer = signer
    }
  }

  /**
   * @desc Returns a bridge set instance.
   * @param {String} tokenSymbol - Token symbol of token of bridge to use.
   * @param {Object} sourceChain - Source chain model.
   * @param {Object} destinationChain - Destination chain model.
   * @example
   *```js
   *import { Hop, Token } from '@hop-protocol/sdk'
   *
   *const hop = new Hop()
   *const bridge = hop.bridge(Token.USDC)
   *```
   */
  bridge (
    tokenSymbol: string,
    sourceChain?: TChain,
    destinationChain?: TChain
  ) {
    return new HopBridge(
      this.signer,
      tokenSymbol,
      sourceChain,
      destinationChain
    )
  }

  canonicalBridge (tokenSymbol: string, chain?: TChain) {
    return new CanonicalBridge(this.signer, tokenSymbol, chain)
  }

  /**
   * @desc Returns hop instance with signer connected. Used for adding or changing signer.
   * @param {Object} signer - Ethers `Signer` for signing transactions.
   * @example
   *```js
   *import { Hop } from '@hop-protocol/sdk'
   *import { Wallet } from 'ethers'
   *
   *const signer = new Wallet(privateKey)
   *let hop = new Hop()
   * // ...
   *hop = hop.connect(signer)
   *```
   */
  connect (signer: Signer) {
    this.signer = signer
    return new Hop(signer)
  }

  /**
   * @desc Returns the connected signer address.
   * @example
   *```js
   *import { Hop } from '@hop-protocol/sdk'
   *
   *const hop = new Hop()
   *const address = await hop.getSignerAddress()
   *console.log(address)
   *```
   */
  getSignerAddress () {
    return this.signer?.getAddress()
  }

  /**
   * @desc Returns the SDK version.
   * @example
   *```js
   *import { Hop } from '@hop-protocol/sdk'
   *
   *const hop = new Hop()
   *console.log(hop.version)
   *```
   */
  get version () {
    return _version
  }

  watch (
    txHash: string,
    token: string,
    _sourceChain: TChain,
    _destinationChain: TChain
  ) {
    const sourceChain = this.toChainModel(_sourceChain)
    const destinationChain = this.toChainModel(_destinationChain)
    const ee = new EventEmitter()

    const update = async () => {
      const bridge = this.bridge(token, sourceChain, destinationChain)
      const l1Bridge = await bridge.getL1Bridge()

      const receipt = await sourceChain.provider.waitForTransaction(txHash)
      ee.emit(Event.Receipt, { chain: sourceChain, receipt })
      ee.emit(Event.SourceTxReceipt, { chain: sourceChain, receipt })
      if (!receipt.status) {
        return
      }
      const sourceTx = await sourceChain.provider.getTransaction(txHash)
      const sourceBlock = await sourceChain.provider.getBlock(
        sourceTx.blockNumber as number
      )
      const sourceTimestamp = sourceBlock?.timestamp

      // L1 -> L2
      if (sourceChain.isL1) {
        const decodedSource = l1Bridge?.interface.decodeFunctionData(
          'sendToL2',
          sourceTx.data
        )
        //const chainId = decodedSource?.chainId
        //const l2Bridge = await bridge.getL2Bridge(destinationChain)
        const exchange = await bridge.getUniswapExchange(destinationChain)
        const pollDest = async () => {
          const blockNumber = await destinationChain.provider.getBlockNumber()
          if (!blockNumber) {
            return false
          }
          let recentLogs: any[] =
            (await exchange?.queryFilter(
              exchange.filters.Swap(),
              (blockNumber as number) - 100
            )) ?? []
          recentLogs = recentLogs.reverse()
          if (!recentLogs || !recentLogs.length) {
            return false
          }
          for (let item of recentLogs) {
            const decodedLog = item.decode(item.data, item.topics)
            if (sourceTx.from === decodedLog.to) {
              if (
                decodedSource?.amount.toString() !==
                decodedLog.amount0In.toString()
              ) {
                continue
              }
              if (!sourceTimestamp) {
                continue
              }
              const destTx = await item.getTransaction()
              const destBlock = await destinationChain.provider.getBlock(
                destTx.blockNumber
              )
              if (!destBlock) {
                continue
              }
              if (destBlock.timestamp - sourceTimestamp < 500) {
                const destTxReceipt = await destinationChain.provider.waitForTransaction(
                  destTx.hash
                )
                ee.emit(Event.Receipt, {
                  chain: destinationChain,
                  receipt: destTxReceipt
                })
                ee.emit(Event.DestinationTxReceipt, {
                  chain: destinationChain,
                  receipt: destTxReceipt
                })
                return true
              }
            }
            return false
          }
          return false
        }
        let res = false
        while (!res) {
          res = await pollDest()
          await wait(5e3)
        }
      }

      // L2 -> L1
      if (!sourceChain.isL1 && destinationChain?.isL1) {
        const wrapper = await bridge.getUniswapWrapper(sourceChain)
        // @ts-ignore
        const decodedSource = wrapper?.interface.decodeFunctionData(
          'swapAndSend',
          sourceTx.data
        )
        let transferHash: string = ''
        for (let log of receipt.logs) {
          const transferSentTopic =
            '0x6ea037b8ea9ecdf62eae513fc0f331de4e4a9df62927a789d840281438d14ce5'
          if (log.topics[0] === transferSentTopic) {
            transferHash = log.topics[1]
          }
        }
        if (!transferHash) {
          return false
        }
        const pollDest = async () => {
          const blockNumber = await destinationChain.provider.getBlockNumber()
          if (!blockNumber) {
            return false
          }
          let recentLogs: any[] =
            (await l1Bridge?.queryFilter(
              l1Bridge.filters.WithdrawalBonded(),
              (blockNumber as number) - 100
            )) ?? []
          recentLogs = recentLogs.reverse()
          if (!recentLogs || !recentLogs.length) {
            return false
          }
          for (let item of recentLogs) {
            if (item.topics[1] === transferHash) {
              const destTx = await item.getTransaction()
              const destTxReceipt = await destinationChain.provider.waitForTransaction(
                destTx.hash
              )
              ee.emit(Event.Receipt, {
                chain: destinationChain,
                receipt: destTxReceipt
              })
              ee.emit(Event.DestinationTxReceipt, {
                chain: destinationChain,
                receipt: destTxReceipt
              })
              return true
            }
          }
          return false
        }
        let res = false
        while (!res) {
          res = await pollDest()
          await wait(5e3)
        }
      }

      // L2 -> L2
      if (!sourceChain.isL1 && !destinationChain?.isL1) {
        const wrapperSource = await bridge.getUniswapWrapper(sourceChain)
        const exchange = await bridge.getUniswapExchange(destinationChain)
        //const destinationBridge = await bridge.getL2Bridge(destinationChain)
        // @ts-ignore
        const decodedSource = wrapperSource?.interface.decodeFunctionData(
          'swapAndSend',
          sourceTx.data
        )
        let transferHash: string = ''
        for (let log of receipt.logs) {
          const transferSentTopic =
            '0x6ea037b8ea9ecdf62eae513fc0f331de4e4a9df62927a789d840281438d14ce5'
          if (log.topics[0] === transferSentTopic) {
            transferHash = log.topics[1]
            break
          }
        }
        if (!transferHash) {
          return false
        }
        const pollDest = async () => {
          const blockNumber = await destinationChain.provider.getBlockNumber()
          if (!blockNumber) {
            return false
          }
          let recentLogs: any[] =
            (await exchange?.queryFilter(
              exchange.filters.Swap(),
              (blockNumber as number) - 100
            )) ?? []
          recentLogs = recentLogs.reverse()
          for (let item of recentLogs) {
            const decodedLog = item.decode(item.data, item.topics)
            if (sourceTx.from === decodedLog.to) {
              /*
            if (
              decodedSource?.amount.toString() !==
              decodedLog.amount0In.toString()
            ) {
              continue
            }
            */
              if (!sourceTimestamp) {
                continue
              }
              const destTx = await item.getTransaction()
              const destBlock = await destinationChain.provider.getBlock(
                destTx.blockNumber
              )
              if (!destBlock) {
                continue
              }
              //if ((destBlock.timestamp - sourceTimestamp) < 500) {
              const destTxReceipt = await destinationChain.provider.waitForTransaction(
                destTx.hash
              )
              ee.emit(Event.Receipt, {
                chain: destinationChain,
                receipt: destTxReceipt
              })
              ee.emit(Event.DestinationTxReceipt, {
                chain: destinationChain,
                receipt: destTxReceipt
              })
              return true
              //}
            }
            return false
          }
          return false
        }
        let res = false
        while (!res) {
          res = await pollDest()
          await wait(5e3)
        }
      }
    }

    update()

    return ee
  }
}

export default Hop
