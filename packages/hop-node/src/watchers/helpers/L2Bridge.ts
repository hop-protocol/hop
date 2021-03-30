import { Contract } from 'ethers'
import Bridge from './Bridge'
import queue from './queue'
import l2UniswapWrapperArtifact from 'src/abi/L2_UniswapWrapper.json'
import l2BridgeWrapperArtifact from 'src/abi/L2_BridgeWrapper.json'
import L2UniswapWrapper from './L2UniswapWrapper'
import L2BridgeWrapper from './L2BridgeWrapper'

export default class L2Bridge extends Bridge {
  l2BridgeContract: Contract
  l2UniswapWrapper: L2UniswapWrapper
  l2BridgeWrapper: L2BridgeWrapper
  TransfersCommitted: string = 'TransfersCommitted'
  TransferSent: string = 'TransferSent'

  constructor (l2BridgeContract: Contract) {
    super(l2BridgeContract)
    this.l2BridgeContract = l2BridgeContract
    this.l2StartListeners()

    if (this.l2BridgeContract.uniswapWrapper) {
      this.l2BridgeContract.uniswapWrapper().then((address: string) => {
        const l2UniswapWrapperContract = new Contract(
          address,
          l2UniswapWrapperArtifact.abi,
          this.l2BridgeContract.signer
        )
        this.l2UniswapWrapper = new L2UniswapWrapper(l2UniswapWrapperContract)
      })
    }

    const l2BridgeWrapperContract = new Contract(
      this.l2BridgeContract.address,
      l2BridgeWrapperArtifact.abi,
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
      const decoded = await this.l2UniswapWrapper.decodeSwapAndSendData(data)
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
    const tx = await this.l2BridgeContract.commitTransfers(destinationChainId, {
      //gasLimit: '0xf4240'
    })

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
      {
        //gasLimit: 1000000
      }
    )

    await tx.wait()
    return tx
  }
}
