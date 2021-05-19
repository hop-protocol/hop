import { providers, Contract, BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import {
  erc20Abi,
  l2AmmWrapperAbi,
  l2BridgeWrapperAbi
} from '@hop-protocol/abi'
import Bridge from './Bridge'
import queue from 'src/decorators/queue'
import L2AmmWrapper from './L2AmmWrapper'
import L2BridgeWrapper from './L2BridgeWrapper'
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

  async hToken (): Promise<Token> {
    const tokenAddress = await this.bridgeContract.hToken()
    const tokenContract = new Contract(
      tokenAddress,
      erc20Abi,
      this.bridgeContract.signer
    )
    return new Token(tokenContract)
  }

  async getTransfersCommittedEvents (
    startBlockNumber: number,
    endBlockNumber: number
  ): Promise<any[]> {
    return this.l2BridgeContract.queryFilter(
      this.l2BridgeContract.filters.TransfersCommitted(),
      startBlockNumber,
      endBlockNumber
    )
  }

  async getTransferSentEvents (
    startBlockNumber: number,
    endBlockNumber: number
  ): Promise<any[]> {
    return this.l2BridgeContract.queryFilter(
      this.l2BridgeContract.filters.TransferSent(),
      startBlockNumber,
      endBlockNumber
    )
  }

  async getChainId (): Promise<number> {
    return Number((await this.l2BridgeContract.getChainId()).toString())
  }

  async decodeCommitTransfersData (data: string): Promise<any> {
    const decoded = await this.l2BridgeContract.interface.decodeFunctionData(
      'commitTransfers',
      data
    )
    const destinationChainId = Number(decoded.destinationChainId.toString())

    return {
      destinationChainId
    }
  }

  async decodeSendData (data: string): Promise<any> {
    let chainId: number
    let attemptSwap = false
    try {
      const decoded = await this.ammWrapper.decodeSwapAndSendData(data)
      chainId = Number(decoded.chainId.toString())
      attemptSwap = decoded.attemptSwap
    } catch (err) {
      const decoded = await this.l2BridgeContract.interface.decodeFunctionData(
        'send',
        data
      )
      chainId = Number(decoded.chainId.toString())
    }

    return {
      chainId,
      attemptSwap
    }
  }

  async getLastCommitTimeForChainId (chainId: number): Promise<number> {
    return Number(
      (await this.l2BridgeContract.lastCommitTimeForChainId(chainId)).toString()
    )
  }

  async getMinimumForceCommitDelay (): Promise<number> {
    return Number(
      (await this.l2BridgeContract.minimumForceCommitDelay()).toString()
    )
  }

  async getPendingAmountForChainId (chainId: number): Promise<BigNumber> {
    const pendingAmount = await this.l2BridgeContract.pendingAmountForChainId(
      chainId
    )
    return pendingAmount
  }

  async getMaxPendingTransfers (): Promise<number> {
    return Number(
      (await this.l2BridgeContract.maxPendingTransfers()).toString()
    )
  }

  async getPendingTransfers (chainId: number): Promise<any[]> {
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
    console.log('bondWithdrawalAndAttemptSwap tx:', tx.hash)

    await tx.wait()
    return tx
  }
}
