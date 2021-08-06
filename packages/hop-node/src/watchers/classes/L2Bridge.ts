import Bridge, { EventCb, EventsBatchOptions } from './Bridge'
import L1Bridge from './L1Bridge'
import L2AmmWrapper from './L2AmmWrapper'
import L2BridgeWrapper from './L2BridgeWrapper'
import Token from './Token'
import delay from 'src/decorators/delay'
import queue from 'src/decorators/queue'
import rateLimitRetry from 'src/decorators/rateLimitRetry'
import { BigNumber, Contract, providers } from 'ethers'
import { Chain } from 'src/constants'
import { Event } from 'src/types'
import { boundClass } from 'autobind-decorator'
import {
  erc20Abi,
  l2AmmWrapperAbi,
  l2BridgeWrapperAbi
} from '@hop-protocol/core/abi'

@boundClass
export default class L2Bridge extends Bridge {
  ammWrapper: L2AmmWrapper
  l2BridgeWrapper: L2BridgeWrapper
  TransfersCommitted: string = 'TransfersCommitted'
  TransferSent: string = 'TransferSent'
  TransferFromL1Completed: string = 'TransferFromL1Completed'

  constructor (l2BridgeContract: Contract) {
    super(l2BridgeContract)

    if (this.getReadBridgeContract().ammWrapper) {
      this.getReadBridgeContract()
        .ammWrapper()
        .then((address: string) => {
          const ammWrapperContract = new Contract(
            address,
            l2AmmWrapperAbi,
            this.getWriteBridgeContract().signer
          )
          this.ammWrapper = new L2AmmWrapper(ammWrapperContract)
        })
    }

    const l2BridgeWrapperContract = new Contract(
      this.getWriteBridgeContract().address,
      l2BridgeWrapperAbi,
      this.getWriteBridgeContract().signer
    )
    this.l2BridgeWrapper = new L2BridgeWrapper(l2BridgeWrapperContract)
  }

  async getL1Bridge (): Promise<L1Bridge> {
    const l1BridgeAddress = await this.getReadBridgeContract().l1BridgeAddress()
    if (!l1BridgeAddress) {
      throw new Error('L1 bridge address not found')
    }
    return L1Bridge.fromAddress(l1BridgeAddress)
  }

  @rateLimitRetry
  async hToken (): Promise<Token> {
    const tokenAddress = await this.getReadBridgeContract().hToken()
    const tokenContract = new Contract(
      tokenAddress,
      erc20Abi,
      this.getWriteBridgeContract().signer
    )
    return new Token(tokenContract)
  }

  @rateLimitRetry
  async getTransferFromL1CompletedEvents (
    startBlockNumber: number,
    endBlockNumber: number
  ): Promise<Event[]> {
    return this.getSpecialReadBridgeContract().queryFilter(
      this.getReadBridgeContract().filters.TransferFromL1Completed(),
      startBlockNumber,
      endBlockNumber
    )
  }

  @rateLimitRetry
  async getTransfersCommittedEvents (
    startBlockNumber: number,
    endBlockNumber: number
  ): Promise<Event[]> {
    return this.getReadBridgeContract().queryFilter(
      this.getReadBridgeContract().filters.TransfersCommitted(),
      startBlockNumber,
      endBlockNumber
    )
  }

  async mapTransfersCommittedEvents (
    cb: EventCb,
    options?: Partial<EventsBatchOptions>
  ) {
    return this.mapEventsBatch(this.getTransfersCommittedEvents, cb, options)
  }

  async getLastTransfersCommittedEvent (): Promise<any> {
    let match: Event = null
    await this.eventsBatch(async (start: number, end: number) => {
      const events = await this.getTransfersCommittedEvents(start, end)
      if (events.length) {
        match = events[events.length - 1]
        return false
      }
    })

    return match
  }

  @rateLimitRetry
  async getTransferSentEvents (
    startBlockNumber: number,
    endBlockNumber: number
  ): Promise<Event[]> {
    return this.getReadBridgeContract().queryFilter(
      this.getReadBridgeContract().filters.TransferSent(),
      startBlockNumber,
      endBlockNumber
    )
  }

  async mapTransferSentEvents (
    cb: EventCb,
    options?: Partial<EventsBatchOptions>
  ) {
    return this.mapEventsBatch(this.getTransferSentEvents, cb, options)
  }

  @rateLimitRetry
  async getTransferSentTimestamp (transferId: string): Promise<number> {
    let match: Event
    await this.eventsBatch(async (start: number, end: number) => {
      const events = await this.getReadBridgeContract().queryFilter(
        this.getReadBridgeContract().filters.TransferSent(),
        start,
        end
      )

      for (const event of events) {
        if (event.args.transferId === transferId) {
          match = event
          return false
        }
      }
    })

    if (!match) {
      return 0
    }

    return this.getEventTimestamp(match)
  }

  @rateLimitRetry
  async getChainId (): Promise<number> {
    if (this.chainId) {
      return this.chainId
    }
    if (!this.getReadBridgeContract()) {
      return super.getChainId()
    }
    const chainId = Number(
      (await this.getReadBridgeContract().getChainId()).toString()
    )
    this.chainId = chainId
    return chainId
  }

  async getChainSlug (): Promise<string> {
    const chainId = await this.getChainId()
    return this.chainIdToSlug(chainId)
  }

  @rateLimitRetry
  async decodeCommitTransfersData (data: string): Promise<any> {
    if (!data) {
      throw new Error('data to decode is required')
    }
    const decoded = await this.getReadBridgeContract().interface.decodeFunctionData(
      'commitTransfers',
      data
    )
    const destinationChainId = Number(decoded.destinationChainId.toString())

    return {
      destinationChainId
    }
  }

  @rateLimitRetry
  async decodeSendData (data: string): Promise<any> {
    if (!data) {
      throw new Error('data to decode is required')
    }
    const methodSig = data.slice(0, 10)
    const sendMethodSig = '0xa6bd1b33'
    let destinationChainId: number
    let attemptSwap = false
    if (methodSig === sendMethodSig) {
      const decoded = await this.getReadBridgeContract().interface.decodeFunctionData(
        'send',
        data
      )
      destinationChainId = Number(decoded.chainId.toString())
    } else {
      const decoded = await this.ammWrapper.decodeSwapAndSendData(data)
      destinationChainId = Number(decoded.chainId.toString())
      attemptSwap = decoded.attemptSwap
    }

    return {
      destinationChainId,
      attemptSwap
    }
  }

  @rateLimitRetry
  async getPendingTransferByIndex (chainId: number, index: number) {
    return this.getReadBridgeContract().pendingTransferIdsForChainId(
      chainId,
      index
    )
  }

  @rateLimitRetry
  async doPendingTransfersExist (chainId: number): Promise<boolean> {
    try {
      await this.getPendingTransferByIndex(chainId, 0)
      return true
    } catch (err) {
      return false
    }
  }

  @rateLimitRetry
  async getLastCommitTimeForChainId (chainId: number): Promise<number> {
    return Number(
      (
        await this.getReadBridgeContract().lastCommitTimeForChainId(chainId)
      ).toString()
    )
  }

  @rateLimitRetry
  async getMinimumForceCommitDelay (): Promise<number> {
    return Number(
      (await this.getReadBridgeContract().minimumForceCommitDelay()).toString()
    )
  }

  @rateLimitRetry
  async getPendingAmountForChainId (chainId: number): Promise<BigNumber> {
    const pendingAmount = await this.getReadBridgeContract().pendingAmountForChainId(
      chainId
    )
    return pendingAmount
  }

  @rateLimitRetry
  async getMaxPendingTransfers (): Promise<number> {
    return Number(
      (await this.getReadBridgeContract().maxPendingTransfers()).toString()
    )
  }

  @rateLimitRetry
  async getPendingTransfers (chainId: number): Promise<string[]> {
    const pendingTransfers: string[] = []
    const max = await this.getMaxPendingTransfers()
    for (let i = 0; i < max; i++) {
      try {
        const pendingTransfer = await this.getPendingTransferByIndex(chainId, i)
        pendingTransfers.push(pendingTransfer)
      } catch (err) {
        break
      }
    }

    return pendingTransfers
  }

  @rateLimitRetry
  async getTransferRootCommittedTxHash (
    transferRootHash: string
  ): Promise<string | undefined> {
    let txHash: string
    await this.eventsBatch(async (start: number, end: number) => {
      const events = await this.getReadBridgeContract().queryFilter(
        this.getReadBridgeContract().filters.TransfersCommitted(),
        start,
        end
      )

      for (const event of events) {
        if (transferRootHash === event.args.rootHash) {
          txHash = event.transactionHash
          return false
        }
      }
      return true
    })

    return txHash
  }

  @rateLimitRetry
  async getTransferSentTxHash (
    transferId: string
  ): Promise<string | undefined> {
    let txHash: string
    await this.eventsBatch(async (start: number, end: number) => {
      const events = await this.getReadBridgeContract().queryFilter(
        this.getReadBridgeContract().filters.TransferSent(),
        start,
        end
      )

      for (const event of events) {
        if (transferId === event.args.transferId) {
          txHash = event.transactionHash
          return false
        }
      }
      return true
    })

    return txHash
  }

  async isTransferRootIdSet (
    transferRootHash: string,
    totalAmount: BigNumber
  ): Promise<boolean> {
    const transferRoot = await this.getTransferRoot(
      transferRootHash,
      totalAmount
    )
    return Number(transferRoot.createdAt.toString()) > 0
  }

  @queue
  @delay
  @rateLimitRetry
  async commitTransfers (
    destinationChainId: number
  ): Promise<providers.TransactionResponse> {
    const tx = await this.getWriteBridgeContract().commitTransfers(
      destinationChainId,
      await this.txOverrides()
    )

    return tx
  }

  @queue
  @delay
  @rateLimitRetry
  async bondWithdrawalAndAttemptSwap (
    recipient: string,
    amount: BigNumber,
    transferNonce: string,
    bonderFee: BigNumber,
    amountOutMin: BigNumber,
    deadline: number
  ): Promise<providers.TransactionResponse> {
    const txOverrides = await this.txOverrides()
    if (this.chainSlug === Chain.Polygon) {
      txOverrides.gasLimit = 1_000_000
    }

    const tx = await this.getWriteBridgeContract().bondWithdrawalAndDistribute(
      recipient,
      amount,
      transferNonce,
      bonderFee,
      amountOutMin,
      deadline,
      txOverrides
    )

    return tx
  }
}
