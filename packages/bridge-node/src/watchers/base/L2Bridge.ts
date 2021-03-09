import { Contract } from 'ethers'
import { isL1NetworkId } from 'src/utils'
import Bridge from './Bridge'

export default class L2Bridge extends Bridge {
  l2BridgeContract: Contract
  TransfersCommitted: string = 'TransfersCommitted'
  TransferSent: string = 'TransferSent'

  constructor (l2BridgeContract: Contract) {
    super(l2BridgeContract)
    this.l2BridgeContract = l2BridgeContract
    this.startListeners()
  }

  startListeners () {
    this.l2BridgeContract
      .on(
        this.l2BridgeContract.filters.TransfersCommitted(),
        (...args: any[]) => this.emit(this.TransfersCommitted, ...args)
      )
      .on(this.l2BridgeContract.filters.TransferSent(), (...args: any[]) =>
        this.emit(this.TransferSent, ...args)
      )
      .on('error', err => {
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
      const decoded = await this.l2BridgeContract.interface.decodeFunctionData(
        'swapAndSend',
        data
      )
      chainId = decoded.chainId.toString()

      if (!isL1NetworkId(chainId)) {
        // L2 to L2 transfers have uniswap parameters set
        if (Number(decoded.destinationDeadline.toString()) > 0) {
          attemptSwap = true
        }
      }
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

  commitTransfers (destinationChainId: string) {
    return this.l2BridgeContract.commitTransfers(destinationChainId, {
      //gasLimit: '0xf4240'
    })
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
}
