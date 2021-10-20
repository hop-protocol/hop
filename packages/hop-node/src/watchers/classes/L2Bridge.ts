import Bridge, { EventCb, EventsBatchOptions } from './Bridge'
import L1Bridge from './L1Bridge'
import L2Amm from './L2Amm'
import L2AmmWrapper from './L2AmmWrapper'
import L2BridgeWrapper from './L2BridgeWrapper'
import Token from './Token'
import rateLimitRetry from 'src/utils/rateLimitRetry'
import { BigNumber, Contract, providers } from 'ethers'
import { Chain } from 'src/constants'
import { Event } from 'src/types'
import { Hop } from '@hop-protocol/sdk'
import {
  erc20Abi,
  l2AmmWrapperAbi,
  l2BridgeWrapperAbi,
  swapAbi as saddleSwapAbi
} from '@hop-protocol/core/abi'
import { config as globalConfig } from 'src/config'

export default class L2Bridge extends Bridge {
  ammWrapper: L2AmmWrapper
  amm: L2Amm
  l2BridgeWrapper: L2BridgeWrapper
  TransfersCommitted: string = 'TransfersCommitted'
  TransferSent: string = 'TransferSent'
  TransferFromL1Completed: string = 'TransferFromL1Completed'

  constructor (l2BridgeContract: Contract) {
    super(l2BridgeContract)

    const addresses = globalConfig.tokens?.[this.tokenSymbol]?.[this.chainSlug]
    if (addresses?.l2AmmWrapper) {
      const ammWrapperContract = new Contract(
        addresses.l2AmmWrapper,
        l2AmmWrapperAbi,
        this.bridgeContract.signer
      )
      this.ammWrapper = new L2AmmWrapper(ammWrapperContract)
    }

    if (addresses?.l2SaddleSwap) {
      const ammContract = new Contract(
        addresses.l2SaddleSwap,
        saddleSwapAbi,
        this.bridgeContract.signer
      )
      this.amm = new L2Amm(ammContract)
    }

    const l2BridgeWrapperContract = new Contract(
      this.bridgeContract.address,
      l2BridgeWrapperAbi,
      this.bridgeContract.signer
    )
    this.l2BridgeWrapper = new L2BridgeWrapper(l2BridgeWrapperContract)
  }

  getL1Bridge = rateLimitRetry(async (): Promise<L1Bridge> => {
    const l1BridgeAddress = await this.bridgeContract.l1BridgeAddress()
    if (!l1BridgeAddress) {
      throw new Error('L1 bridge address not found')
    }
    return L1Bridge.fromAddress(l1BridgeAddress)
  })

  canonicalToken = rateLimitRetry(async (): Promise<Token> => {
    const tokenAddress = await this.ammWrapper.contract.l2CanonicalToken()
    const tokenContract = new Contract(
      tokenAddress,
      erc20Abi,
      this.bridgeContract.signer
    )
    return new Token(tokenContract)
  })

  hToken = rateLimitRetry(async (): Promise<Token> => {
    const tokenAddress = await this.bridgeContract.hToken()
    const tokenContract = new Contract(
      tokenAddress,
      erc20Abi,
      this.bridgeContract.signer
    )
    return new Token(tokenContract)
  })

  getTransferFromL1CompletedEvents = rateLimitRetry((
    startBlockNumber: number,
    endBlockNumber: number
  ): Promise<Event[]> => {
    return this.bridgeContract.queryFilter(
      this.bridgeContract.filters.TransferFromL1Completed(),
      startBlockNumber,
      endBlockNumber
    )
  })

  getTransfersCommittedEvents = rateLimitRetry(async (
    startBlockNumber: number,
    endBlockNumber: number
  ): Promise<Event[]> => {
    return this.bridgeContract.queryFilter(
      this.bridgeContract.filters.TransfersCommitted(),
      startBlockNumber,
      endBlockNumber
    )
  })

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

  getTransferSentEvents = rateLimitRetry(async (
    startBlockNumber: number,
    endBlockNumber: number
  ): Promise<Event[]> => {
    return this.bridgeContract.queryFilter(
      this.bridgeContract.filters.TransferSent(),
      startBlockNumber,
      endBlockNumber
    )
  })

  async mapTransferSentEvents (
    cb: EventCb,
    options?: Partial<EventsBatchOptions>
  ) {
    return this.mapEventsBatch(this.getTransferSentEvents, cb, options)
  }

  async getTransferSentTimestamp (transferId: string): Promise<number> {
    let match: Event
    await this.eventsBatch(async (start: number, end: number) => {
      const events = await this.getTransferSentEvents(
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

  sendHTokens = rateLimitRetry(async (
    destinationChainId: number,
    amount: BigNumber
  ): Promise<providers.TransactionResponse> => {
    const isSupportedChainId = await this.isSupportedChainId(destinationChainId)
    if (!isSupportedChainId) {
      throw new Error(`chain ID "${destinationChainId}" is not supported`)
    }

    const sdk = new Hop(globalConfig.network)
    const bridge = sdk.bridge(this.tokenSymbol)
    const recipient = await this.getBonderAddress()
    const relayer = recipient
    const relayerFee = '0'
    const deadline = '0' // must be 0
    const amountOutMin = '0' // must be 0
    const destinationChain = this.chainIdToSlug(destinationChainId)
    const isNativeToken = this.tokenSymbol === 'MATIC' && this.chainSlug === Chain.Polygon
    const { destinationTxFee } = await bridge.getSendData(amount, this.chainSlug, destinationChain)
    let bonderFee = await bridge.getBonderFee(
      amount,
      this.chainSlug,
      destinationChain
    )

    bonderFee = bonderFee.add(destinationTxFee)

    if (bonderFee.gt(amount)) {
      throw new Error(`amount must be greater than bonder fee. Estimated bonder fee is ${this.formatUnits(bonderFee)}`)
    }

    return this.bridgeContract.send(
      destinationChainId,
      recipient,
      amount,
      bonderFee,
      amountOutMin,
      deadline,
      {
        ...(await this.txOverrides()),
        value: isNativeToken ? amount : undefined
      }
    )
  })

  sendCanonicalTokens = rateLimitRetry((
    destinationChainId: number,
    amount: BigNumber
  ): Promise<providers.TransactionResponse> => {
    return this.ammWrapper.swapAndSend(
      destinationChainId,
      amount,
      this.tokenSymbol
    )
  })

  getChainId = rateLimitRetry(async (): Promise<number> => {
    if (this.chainId) {
      return this.chainId
    }
    if (!this.bridgeContract) {
      return super.getChainId()
    }
    const chainId = Number(
      (await this.bridgeContract.getChainId()).toString()
    )
    this.chainId = chainId
    return chainId
  })

  async getChainSlug (): Promise<Chain> {
    const chainId = await this.getChainId()
    return this.chainIdToSlug(chainId)
  }

  decodeCommitTransfersData (data: string): any {
    if (!data) {
      throw new Error('data to decode is required')
    }
    const decoded = this.bridgeContract.interface.decodeFunctionData(
      'commitTransfers',
      data
    )
    const destinationChainId = Number(decoded.destinationChainId.toString())

    return {
      destinationChainId
    }
  }

  decodeSendData (data: string): any {
    if (!data) {
      throw new Error('data to decode is required')
    }
    const methodSig = data.slice(0, 10)
    const sendMethodSig = '0xa6bd1b33'
    let destinationChainId: number
    let attemptSwap = false
    if (methodSig === sendMethodSig) {
      const decoded = this.bridgeContract.interface.decodeFunctionData(
        'send',
        data
      )
      destinationChainId = Number(decoded.chainId.toString())
    } else {
      const decoded = this.ammWrapper.decodeSwapAndSendData(data)
      destinationChainId = Number(decoded.chainId.toString())
      attemptSwap = decoded.attemptSwap
    }

    return {
      destinationChainId,
      attemptSwap
    }
  }

  getPendingTransferByIndex = rateLimitRetry(async (chainId: number, index: number) => {
    return this.bridgeContract.pendingTransferIdsForChainId(
      chainId,
      index
    )
  })

  async doPendingTransfersExist (chainId: number): Promise<boolean> {
    try {
      await this.getPendingTransferByIndex(chainId, 0)
      return true
    } catch (err) {
      return false
    }
  }

  getLastCommitTimeForChainId = rateLimitRetry(async (chainId: number): Promise<number> => {
    return Number(
      (
        await this.bridgeContract.lastCommitTimeForChainId(chainId)
      ).toString()
    )
  })

  getMinimumForceCommitDelay = rateLimitRetry(async (): Promise<number> => {
    return Number(
      (await this.bridgeContract.minimumForceCommitDelay()).toString()
    )
  })

  getPendingAmountForChainId = rateLimitRetry(async (chainId: number): Promise<BigNumber> => {
    const pendingAmount = await this.bridgeContract.pendingAmountForChainId(
      chainId
    )
    return pendingAmount
  })

  getMaxPendingTransfers = rateLimitRetry(async (): Promise<number> => {
    return Number(
      (await this.bridgeContract.maxPendingTransfers()).toString()
    )
  })

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

  async getTransferRootCommittedTxHash (
    transferRootHash: string
  ): Promise<string | undefined> {
    let txHash: string
    await this.eventsBatch(async (start: number, end: number) => {
      const events = await this.getTransfersCommittedEvents(
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

  async getTransferSentTxHash (
    transferId: string
  ): Promise<string | undefined> {
    let txHash: string
    await this.eventsBatch(async (start: number, end: number) => {
      const events = await this.getTransferSentEvents(
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

  commitTransfers = rateLimitRetry(async (
    destinationChainId: number
  ): Promise<providers.TransactionResponse> => {
    const tx = await this.bridgeContract.commitTransfers(
      destinationChainId,
      await this.txOverrides()
    )

    return tx
  })

  bondWithdrawalAndAttemptSwap = rateLimitRetry(async (
    recipient: string,
    amount: BigNumber,
    transferNonce: string,
    bonderFee: BigNumber,
    amountOutMin: BigNumber,
    deadline: BigNumber,
    gasCostInToken?: BigNumber
  ): Promise<providers.TransactionResponse> => {
    const txOverrides = await this.txOverrides()
    if (this.chainSlug === Chain.Polygon) {
      txOverrides.gasLimit = 1_000_000
    }

    const payload = [
      recipient,
      amount,
      transferNonce,
      bonderFee,
      amountOutMin,
      deadline,
      txOverrides
    ]

    const gasLimit = await this.bridgeContract.estimateGas.bondWithdrawalAndDistribute(...payload)
    await this.checkBonderFee(amount, bonderFee, gasLimit, this.tokenSymbol, gasCostInToken)

    const tx = await this.bridgeContract.bondWithdrawalAndDistribute(...payload)

    return tx
  })

  isSupportedChainId = rateLimitRetry((chainId: number): Promise<boolean> => {
    return this.bridgeContract.activeChainIds(
      chainId
    )
  })
}
