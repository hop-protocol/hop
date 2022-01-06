import Bridge, { EventCb, EventsBatchOptions } from './Bridge'
import L1Bridge from './L1Bridge'
import L2Amm from './L2Amm'
import L2AmmWrapper from './L2AmmWrapper'
import Token from './Token'
import erc20Abi from '@hop-protocol/core/abi/generated/ERC20.json'
import l2AmmWrapperAbi from '@hop-protocol/core/abi/generated/L2_AmmWrapper.json'
import saddleSwapAbi from '@hop-protocol/core/abi/generated/Swap.json'
import { BigNumber, Contract, providers } from 'ethers'
import { Chain } from 'src/constants'
import { ERC20 } from '@hop-protocol/core/contracts'
import { Hop } from '@hop-protocol/sdk'
import { L2Bridge as L2BridgeContract, TransferFromL1CompletedEvent, TransferSentEvent, TransfersCommittedEvent } from '@hop-protocol/core/contracts/L2Bridge'
import { PayableOverrides } from '@ethersproject/contracts'
import { config as globalConfig } from 'src/config'

export default class L2Bridge extends Bridge {
  ammWrapper: L2AmmWrapper
  amm: L2Amm
  TransfersCommitted: string = 'TransfersCommitted'
  TransferSent: string = 'TransferSent'
  TransferFromL1Completed: string = 'TransferFromL1Completed'

  constructor (private readonly l2BridgeContract: L2BridgeContract) {
    super(l2BridgeContract)

    const addresses = globalConfig.addresses[this.tokenSymbol]?.[this.chainSlug]
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
    const tokenContract = new Contract(
      tokenAddress,
      erc20Abi,
      this.bridgeContract.signer
    ) as ERC20
    return new Token(tokenContract)
  }

  hToken = async (): Promise<Token> => {
    const tokenAddress = await this.l2BridgeContract.hToken()
    const tokenContract = new Contract(
      tokenAddress,
      erc20Abi,
      this.bridgeContract.signer
    ) as ERC20
    return new Token(tokenContract)
  }

  getTransferFromL1CompletedEvents = async (
    startBlockNumber: number,
    endBlockNumber: number
  ): Promise<TransferFromL1CompletedEvent[]> => {
    return await this.bridgeContract.queryFilter(
      this.l2BridgeContract.filters.TransferFromL1Completed(),
      startBlockNumber,
      endBlockNumber
    )
  }

  getTransfersCommittedEvents = async (
    startBlockNumber: number,
    endBlockNumber: number
  ): Promise<TransfersCommittedEvent[]> => {
    return await this.bridgeContract.queryFilter(
      this.l2BridgeContract.filters.TransfersCommitted(),
      startBlockNumber,
      endBlockNumber
    )
  }

  async mapTransfersCommittedEvents<R> (
    cb: EventCb<TransfersCommittedEvent, R>,
    options?: Partial<EventsBatchOptions>
  ) {
    return await this.mapEventsBatch(this.getTransfersCommittedEvents, cb, options)
  }

  getTransferSentEvents = async (
    startBlockNumber: number,
    endBlockNumber: number
  ): Promise<TransferSentEvent[]> => {
    return await this.l2BridgeContract.queryFilter(
      this.l2BridgeContract.filters.TransferSent(),
      startBlockNumber,
      endBlockNumber
    )
  }

  async mapTransferSentEvents<R> (
    cb: EventCb<TransferSentEvent, R>,
    options?: Partial<EventsBatchOptions>
  ) {
    return await this.mapEventsBatch(this.getTransferSentEvents, cb, options)
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
    const isNativeToken = this.tokenSymbol === 'MATIC' && this.chainSlug === Chain.Polygon
    const isHTokenSend = true
    const { totalFee } = await bridge.getSendData(amount, this.chainSlug, destinationChain, isHTokenSend)

    if (totalFee.gt(amount)) {
      throw new Error(`amount must be greater than bonder fee. Estimated bonder fee is ${this.formatUnits(totalFee)}`)
    }

    const overrides: PayableOverrides = {
      ...(await this.txOverrides()),
      value: isNativeToken ? amount : undefined
    }

    return await this.l2BridgeContract.send(
      destinationChainId,
      recipient,
      amount,
      totalFee,
      amountOutMin,
      deadline,
      overrides
    )
  }

  sendCanonicalTokens = async (
    destinationChainId: number,
    amount: BigNumber,
    recipient: string
  ): Promise<providers.TransactionResponse> => {
    return await this.ammWrapper.swapAndSend(
      destinationChainId,
      amount,
      this.tokenSymbol,
      recipient
    )
  }

  getChainId = async (): Promise<number> => {
    if (this.chainId) {
      return this.chainId
    }
    if (!this.bridgeContract) {
      return await super.getChainId()
    }
    const chainId = Number(
      (await this.bridgeContract.getChainId()).toString()
    )
    this.chainId = chainId
    return chainId
  }

  getPendingTransferByIndex = async (chainId: number, index: number) => {
    return await this.l2BridgeContract.pendingTransferIdsForChainId(
      chainId,
      index
    )
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
    destinationChainId: number
  ): Promise<providers.TransactionResponse> => {
    const tx = await this.l2BridgeContract.commitTransfers(
      destinationChainId,
      await this.txOverrides()
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
    const txOverrides = await this.txOverrides()
    // Polygon's gas estimates do not always work for this call. They result in an OOG
    // with either a failed tx or a successful tx with a failed AMM swap
    if (this.chainSlug === Chain.Polygon) {
      txOverrides.gasLimit = 500_000
    }

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
    return await this.l2BridgeContract.activeChainIds(
      chainId
    )
  }
}
