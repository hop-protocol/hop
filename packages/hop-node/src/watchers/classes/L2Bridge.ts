import { providers, Contract, BigNumber, Event } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import {
  erc20Abi,
  l2AmmWrapperAbi,
  l2BridgeWrapperAbi
} from '@hop-protocol/abi'
import Bridge, { EventsBatchOptions, EventCb } from './Bridge'
import rateLimitRetry from 'src/decorators/rateLimitRetry'
import queue from 'src/decorators/queue'
import L2AmmWrapper from './L2AmmWrapper'
import L2BridgeWrapper from './L2BridgeWrapper'
import L1Bridge from './L1Bridge'
import Token from './Token'
import { Chain } from 'src/constants'

export default class L2Bridge extends Bridge {
  l2BridgeContract: Contract
  ammWrapper: L2AmmWrapper
  l2BridgeWrapper: L2BridgeWrapper
  TransfersCommitted: string = 'TransfersCommitted'
  TransferSent: string = 'TransferSent'

  constructor (l2BridgeContract: Contract) {
    super(l2BridgeContract)
    this.l2BridgeContract = l2BridgeContract
    this.l2StartListeners()

    if (this.l2BridgeContract.ammWrapper) {
      this.l2BridgeContract.ammWrapper().then((address: string) => {
        const ammWrapperContract = new Contract(
          address,
          l2AmmWrapperAbi,
          this.l2BridgeContract.signer
        )
        this.ammWrapper = new L2AmmWrapper(ammWrapperContract)
      })
    }

    const l2BridgeWrapperContract = new Contract(
      this.l2BridgeContract.address,
      l2BridgeWrapperAbi,
      this.l2BridgeContract.signer
    )
    this.l2BridgeWrapper = new L2BridgeWrapper(l2BridgeWrapperContract)
  }

  l2StartListeners (): void {
    if (this.l2BridgeContract.filters.TransfersCommitted) {
      this.l2BridgeContract.on(
        this.l2BridgeContract.filters.TransfersCommitted(),
        (...args: any[]) => this.emit(this.TransfersCommitted, ...args)
      )
    }
    if (this.l2BridgeContract.filters.TransferSent) {
      this.l2BridgeContract.on(
        this.l2BridgeContract.filters.TransferSent(),
        (...args: any[]) => this.emit(this.TransferSent, ...args)
      )
    }

    this.l2BridgeContract.on('error', err => {
      this.emit('error', err)
    })
  }

  async getL1Bridge (): Promise<L1Bridge> {
    const l1BridgeAddress = await this.contract.l1BridgeAddress()
    if (!l1BridgeAddress) {
      throw new Error('L1 bridge address not found')
    }
    return L1Bridge.fromAddress(l1BridgeAddress)
  }

  @rateLimitRetry
  async hToken (): Promise<Token> {
    const tokenAddress = await this.bridgeContract.hToken()
    const tokenContract = new Contract(
      tokenAddress,
      erc20Abi,
      this.bridgeContract.signer
    )
    return new Token(tokenContract)
  }

  @rateLimitRetry
  async getTransfersCommittedEvents (
    startBlockNumber: number,
    endBlockNumber: number
  ): Promise<Event[]> {
    return this.l2BridgeContract.queryFilter(
      this.l2BridgeContract.filters.TransfersCommitted(),
      startBlockNumber,
      endBlockNumber
    )
  }

  async mapTransfersCommittedEvents (
    cb: EventCb,
    options?: Partial<EventsBatchOptions>
  ) {
    return this.mapEventsBatch(
      this.getTransfersCommittedEvents.bind(this),
      cb,
      options
    )
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
    return this.l2BridgeContract.queryFilter(
      this.l2BridgeContract.filters.TransferSent(),
      startBlockNumber,
      endBlockNumber
    )
  }

  async mapTransferSentEvents (
    cb: EventCb,
    options?: Partial<EventsBatchOptions>
  ) {
    return this.mapEventsBatch(
      this.getTransferSentEvents.bind(this),
      cb,
      options
    )
  }

  @rateLimitRetry
  async getTransferSentTimestamp (transferId: string): Promise<number> {
    let match: Event
    await this.eventsBatch(async (start: number, end: number) => {
      const events = await this.l2BridgeContract.queryFilter(
        this.l2BridgeContract.filters.TransferSent(),
        start,
        end
      )

      for (let event of events) {
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
    if (!this.l2BridgeContract) {
      return super.getChainId()
    }
    return Number((await this.l2BridgeContract.getChainId()).toString())
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
    const decoded = await this.l2BridgeContract.interface.decodeFunctionData(
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
    let destinationChainId: number
    let attemptSwap = false
    try {
      const decoded = await this.ammWrapper.decodeSwapAndSendData(data)
      destinationChainId = Number(decoded.chainId.toString())
      attemptSwap = decoded.attemptSwap
    } catch (err) {
      const decoded = await this.l2BridgeContract.interface.decodeFunctionData(
        'send',
        data
      )
      destinationChainId = Number(decoded.chainId.toString())
    }

    return {
      destinationChainId,
      attemptSwap
    }
  }

  @rateLimitRetry
  async getLastCommitTimeForChainId (chainId: number): Promise<number> {
    return Number(
      (await this.l2BridgeContract.lastCommitTimeForChainId(chainId)).toString()
    )
  }

  @rateLimitRetry
  async getMinimumForceCommitDelay (): Promise<number> {
    return Number(
      (await this.l2BridgeContract.minimumForceCommitDelay()).toString()
    )
  }

  @rateLimitRetry
  async getPendingAmountForChainId (chainId: number): Promise<BigNumber> {
    const pendingAmount = await this.l2BridgeContract.pendingAmountForChainId(
      chainId
    )
    return pendingAmount
  }

  @rateLimitRetry
  async getMaxPendingTransfers (): Promise<number> {
    return Number(
      (await this.l2BridgeContract.maxPendingTransfers()).toString()
    )
  }

  @rateLimitRetry
  async getPendingTransfers (chainId: number): Promise<string[]> {
    const pendingTransfers: string[] = []
    const max = await this.getMaxPendingTransfers()
    for (let i = 0; i < max; i++) {
      try {
        const pendingTransfer = await this.l2BridgeContract.pendingTransferIdsForChainId(
          chainId,
          i
        )
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
      const events = await this.l2BridgeContract.queryFilter(
        this.l2BridgeContract.filters.TransfersCommitted(),
        start,
        end
      )

      for (let event of events) {
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
      const events = await this.l2BridgeContract.queryFilter(
        this.l2BridgeContract.filters.TransferSent(),
        start,
        end
      )

      for (let event of events) {
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

  @rateLimitRetry
  @queue
  async commitTransfers (
    destinationChainId: number
  ): Promise<providers.TransactionResponse> {
    const tx = await this.l2BridgeContract.commitTransfers(
      destinationChainId,
      await this.txOverrides()
    )
    await tx.wait()
    return tx
  }

  @rateLimitRetry
  @queue
  async bondWithdrawalAndAttemptSwap (
    recipient: string,
    amount: BigNumber,
    transferNonce: string,
    bonderFee: BigNumber,
    amountOutMin: BigNumber,
    deadline: number
  ): Promise<providers.TransactionResponse> {
    let txOverrides = await this.txOverrides()
    if (this.chainSlug === Chain.Polygon) {
      txOverrides.gasLimit = 1_000_000
    }

    const tx = await this.l2BridgeContract.bondWithdrawalAndDistribute(
      recipient,
      amount,
      transferNonce,
      bonderFee,
      amountOutMin,
      deadline,
      txOverrides
    )

    //console.log('bondWithdrawalAndAttemptSwap tx:', tx.hash)
    //await tx.wait()
    return tx
  }
}
