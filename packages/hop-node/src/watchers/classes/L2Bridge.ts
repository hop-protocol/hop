import Bridge, { type EventCb, type EventsBatchOptions } from './Bridge.js'
import L1Bridge from './L1Bridge.js'
import L2Amm from './L2Amm.js'
import L2AmmWrapper from './L2AmmWrapper.js'
import Token from './Token.js'
import { Chain } from '@hop-protocol/hop-node-core/constants'
import { Hop } from '@hop-protocol/sdk'
import {
  ERC20__factory,
  L2_AmmWrapper__factory,
  Swap__factory
} from '@hop-protocol/sdk/contracts'
import { config as globalConfig } from '#config/index.js'
import type { BigNumber, providers } from 'ethers'
import type { ERC20 } from '@hop-protocol/sdk/contracts'
import type {
  L2_Bridge as L2BridgeContract,
  TransferFromL1CompletedEvent,
  TransferSentEvent,
  TransfersCommittedEvent
} from '@hop-protocol/sdk/contracts/L2_Bridge'
import type { TxOverrides } from '@hop-protocol/hop-node-core/types'

export default class L2Bridge extends Bridge {
  ammWrapper!: L2AmmWrapper
  amm!: L2Amm
  TransfersCommitted: string = 'TransfersCommitted'
  TransferSent: string = 'TransferSent'
  TransferFromL1Completed: string = 'TransferFromL1Completed'

  constructor (private readonly l2BridgeContract: L2BridgeContract) {
    super(l2BridgeContract)

    const addresses = globalConfig.addresses[this.tokenSymbol]?.[this.chainSlug]
    if (addresses?.l2AmmWrapper) {
      const ammWrapperContract = L2_AmmWrapper__factory.connect(
        addresses.l2AmmWrapper,
        this.bridgeContract.signer
      )
      this.ammWrapper = new L2AmmWrapper(ammWrapperContract)
    }

    if (addresses?.l2SaddleSwap) {
      const ammContract = Swap__factory.connect(
        addresses.l2SaddleSwap,
        this.bridgeContract.signer
      )
      this.amm = new L2Amm(ammContract)
    }
  }

  getL1Bridge = async (): Promise<L1Bridge> => {
    const l1BridgeAddress = await this.l2BridgeContract.l1BridgeAddress()
    if (!l1BridgeAddress) {
      throw new Error('L1 bridge address not found')
    }
    return L1Bridge.fromAddress(l1BridgeAddress)
  }

  canonicalToken = async (): Promise<Token> => {
    const tokenAddress = await this.ammWrapper.contract.l2CanonicalToken()
    const tokenContract = ERC20__factory.connect(
      tokenAddress,
      this.bridgeContract.signer
    ) as ERC20
    return new Token(tokenContract)
  }

  hToken = async (): Promise<Token> => {
    const tokenAddress = await this.l2BridgeContract.hToken()
    const tokenContract = ERC20__factory.connect(
      tokenAddress,
      this.bridgeContract.signer
    ) as ERC20
    return new Token(tokenContract)
  }

  getTransferFromL1CompletedEvents = async (
    startBlockNumber: number,
    endBlockNumber: number
  ): Promise<TransferFromL1CompletedEvent[]> => {
    return this.bridgeContract.queryFilter(
      this.l2BridgeContract.filters.TransferFromL1Completed(),
      startBlockNumber,
      endBlockNumber
    )
  }

  getTransfersCommittedEvents = async (
    startBlockNumber: number,
    endBlockNumber: number
  ): Promise<TransfersCommittedEvent[]> => {
    return this.bridgeContract.queryFilter(
      this.l2BridgeContract.filters.TransfersCommitted(),
      startBlockNumber,
      endBlockNumber
    )
  }

  async mapTransfersCommittedEvents<R> (
    cb: EventCb<TransfersCommittedEvent, R>,
    options?: Partial<EventsBatchOptions>
  ) {
    return this.mapEventsBatch(this.getTransfersCommittedEvents, cb, options)
  }

  getTransferSentEvents = async (
    startBlockNumber: number,
    endBlockNumber: number
  ): Promise<TransferSentEvent[]> => {
    return this.l2BridgeContract.queryFilter(
      this.l2BridgeContract.filters.TransferSent(),
      startBlockNumber,
      endBlockNumber
    )
  }

  async mapTransferSentEvents<R> (
    cb: EventCb<TransferSentEvent, R>,
    options?: Partial<EventsBatchOptions>
  ) {
    return this.mapEventsBatch(this.getTransferSentEvents, cb, options)
  }

  async getTransferSentEvent (transferId: string): Promise<TransferSentEvent | null> {
    let match: TransferSentEvent | undefined
    await this.eventsBatch(async (start: number, end: number) => {
      const events: any[] = await this.l2BridgeContract.queryFilter(
        this.l2BridgeContract.filters.TransferSent(transferId),
        start,
        end
      )

      for (const event of events) {
        if (event.args.transferId === transferId) {
          match = event
          return false
        }
      }
    }, { startBlockNumber: this.bridgeDeployedBlockNumber })

    if (!match) {
      return null
    }

    return match
  }

  sendHTokens = async (
    destinationChainId: number,
    amount: BigNumber,
    recipient: string
  ): Promise<providers.TransactionResponse> => {
    const isSupportedChainId = await this.isSupportedChainId(destinationChainId)
    if (!isSupportedChainId) {
      throw new Error(`chain ID "${destinationChainId}" is not supported`)
    }

    const sdk = new Hop(globalConfig.network)
    const bridge = sdk.bridge(this.tokenSymbol)
    const deadline = '0' // must be 0
    const amountOutMin = '0' // must be 0
    const destinationChain = this.chainIdToSlug(destinationChainId)
    const isHTokenSend = true
    const { totalFee } = await bridge.getSendData(amount, this.chainSlug, destinationChain, isHTokenSend)

    if (totalFee.gt(amount)) {
      throw new Error(`amount must be greater than bonder fee. Estimated bonder fee is ${this.formatUnits(totalFee)}`)
    }

    return this.l2BridgeContract.send(
      destinationChainId,
      recipient,
      amount,
      totalFee,
      amountOutMin,
      deadline,
      await this.txOverrides()
    )
  }

  sendCanonicalTokens = async (
    destinationChainId: number,
    amount: BigNumber,
    recipient: string
  ): Promise<providers.TransactionResponse> => {
    return this.ammWrapper.swapAndSend(
      destinationChainId,
      amount,
      this.tokenSymbol,
      recipient
    )
  }

  override getChainId = async (): Promise<number> => {
    if (this.chainId) {
      return this.chainId
    }
    if (!this.bridgeContract) {
      // latest TypeScript version throws an if we call super, so we call a separate function
      return this.getChainIdFn()
    }
    const chainId = Number(
      (await this.bridgeContract.getChainId()).toString()
    )
    this.chainId = chainId
    return chainId
  }

  getPendingTransferByIndex = async (chainId: number, index: number) => {
    return this.l2BridgeContract.pendingTransferIdsForChainId(
      chainId,
      index
    )
  }

  pendingTransferExistsAtIndex = async (chainId: number, index: number) => {
    try {
      await this.getPendingTransferByIndex(chainId, index)
      return true
    } catch (err) {
      return false
    }
  }

  async doPendingTransfersExist (chainId: number): Promise<boolean> {
    try {
      await this.getPendingTransferByIndex(chainId, 0)
      return true
    } catch (err) {
      return false
    }
  }

  getPendingAmountForChainId = async (chainId: number): Promise<BigNumber> => {
    const pendingAmount = await this.l2BridgeContract.pendingAmountForChainId(
      chainId
    )
    return pendingAmount
  }

  getMaxPendingTransfers = async (): Promise<number> => {
    return Number(
      (await this.l2BridgeContract.maxPendingTransfers()).toString()
    )
  }

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

  async getTransfersCommittedEvent (transferRootHash: string): Promise<TransfersCommittedEvent | null> {
    let match: TransfersCommittedEvent | undefined
    await this.eventsBatch(async (start: number, end: number) => {
      const events: any[] = await this.l2BridgeContract.queryFilter(
        this.l2BridgeContract.filters.TransfersCommitted(null, transferRootHash),
        start,
        end
      )

      for (const event of events) {
        if (event.args.rootHash === transferRootHash) {
          match = event
          return false
        }
      }
    }, { startBlockNumber: this.bridgeDeployedBlockNumber })

    if (!match) {
      return null
    }

    return match
  }

  commitTransfers = async (
    destinationChainId: number,
    contractAddress?: string
  ): Promise<providers.TransactionResponse> => {
    let contract = this.l2BridgeContract
    if (contractAddress) {
      contract = contract.attach(contractAddress)
    }

    const txOverrides: TxOverrides = await this.txOverrides()
    if (this.chainSlug === Chain.Polygon) {
      const gasLimit = 15_000_000
      txOverrides.gasLimit = gasLimit
    }

    const tx = await contract.commitTransfers(
      destinationChainId,
      txOverrides
    )

    return tx
  }

  bondWithdrawalAndAttemptSwap = async (
    recipient: string,
    amount: BigNumber,
    transferNonce: string,
    bonderFee: BigNumber,
    amountOutMin: BigNumber,
    deadline: BigNumber
  ): Promise<providers.TransactionResponse> => {
    const txOverrides: TxOverrides = await this.txOverrides()

    // Define a max gasLimit in order to avoid gas siphoning
    let gasLimit = 500_000
    if (this.chainSlug === Chain.Arbitrum) {
      gasLimit = 10_000_000
    }
    if (this.chainSlug === Chain.Nova) {
      gasLimit = 5_000_000
    }
    txOverrides.gasLimit = gasLimit

    const payload = [
      recipient,
      amount,
      transferNonce,
      bonderFee,
      amountOutMin,
      deadline,
      txOverrides
    ] as const

    const tx = await this.l2BridgeContract.bondWithdrawalAndDistribute(...payload)
    return tx
  }

  isSupportedChainId = async (chainId: number): Promise<boolean> => {
    return this.l2BridgeContract.activeChainIds(
      chainId
    )
  }

  async getOnChainMinBonderFeeAbsolute (): Promise<BigNumber> {
    return this.l2BridgeContract.minBonderFeeAbsolute()
  }
}
