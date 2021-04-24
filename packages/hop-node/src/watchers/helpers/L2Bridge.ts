import { Contract } from 'ethers'
import Bridge from './Bridge'
import queue from './queue'
import { l2AmmWrapperAbi, l2BridgeWrapperAbi } from '@hop-protocol/abi'
import L2AmmWrapper from './L2AmmWrapper'
import L2BridgeWrapper from './L2BridgeWrapper'

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

  l2StartListeners () {
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

  async getTransfersCommitedEvents (
    startBlockNumber: number,
    endBlockNumber: number
  ) {
    return this.l2BridgeContract.queryFilter(
      this.l2BridgeContract.filters.TransfersCommitted(),
      startBlockNumber,
      endBlockNumber
    )
  }

  async getTransferSentEvents (
    startBlockNumber: number,
    endBlockNumber: number
  ) {
    return this.l2BridgeContract.queryFilter(
      this.l2BridgeContract.filters.TransferSent(),
      startBlockNumber,
      endBlockNumber
    )
  }

  async getChainId () {
    return (await this.l2BridgeContract.getChainId()).toString()
  }

  async decodeCommitTransfersData (data: string) {
    const decoded = await this.l2BridgeContract.interface.decodeFunctionData(
      'commitTransfers',
      data
    )
    const destinationChainId = decoded.destinationChainId.toString()

    return {
      destinationChainId
    }
  }

  async decodeSendData (data: string) {
    let chainId = ''
    let attemptSwap = false
    try {
      const decoded = await this.ammWrapper.decodeSwapAndSendData(data)
      chainId = decoded.chainId
      attemptSwap = decoded.attemptSwap
    } catch (err) {
      const decoded = await this.l2BridgeContract.interface.decodeFunctionData(
        'send',
        data
      )
      chainId = decoded.chainId.toString()
    }

    return {
      chainId,
      attemptSwap
    }
  }

  async getLastCommitTimeForChainId (chainId: string) {
    return Number(
      (await this.l2BridgeContract.lastCommitTimeForChainId(chainId)).toString()
    )
  }

  async getMinimumForceCommitDelay () {
    return Number(
      (await this.l2BridgeContract.minimumForceCommitDelay()).toString()
    )
  }

  async getPendingAmountForChainId (chainId: string) {
    return Number(
      (await this.l2BridgeContract.pendingAmountForChainId(chainId)).toString()
    )
  }

  async getMaxPendingTransfers () {
    return Number(
      (await this.l2BridgeContract.maxPendingTransfers()).toString()
    )
  }

  async getPendingTransfers (chainId: string) {
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
  async commitTransfers (destinationChainId: string) {
    const tx = await this.l2BridgeContract.commitTransfers(
      destinationChainId,
      this.txOverrides
    )
    await tx.wait()
    return tx
  }

  @queue
  async bondWithdrawalAndAttemptSwap (
    recipient: string,
    amount: string,
    transferNonce: string,
    bonderFee: string,
    amountOutMin: string,
    deadline: string
  ) {
    const tx = await this.l2BridgeContract.bondWithdrawalAndDistribute(
      recipient,
      amount,
      transferNonce,
      bonderFee,
      amountOutMin,
      deadline,
      this.txOverrides
    )

    await tx.wait()
    return tx
  }
}
