import { Contract } from 'ethers'
import { isL1NetworkId } from 'src/utils'

export default class L2UniswapWrapper {
  l2UniswapWrapperContract: Contract

  constructor (l2UniswapWrapperContract: Contract) {
    this.l2UniswapWrapperContract = l2UniswapWrapperContract
  }

  async decodeSwapAndSendData (data: string) {
    let chainId = ''
    let attemptSwap = false
    const decoded = await this.l2UniswapWrapperContract.interface.decodeFunctionData(
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

    return {
      chainId,
      attemptSwap
    }
  }
}
