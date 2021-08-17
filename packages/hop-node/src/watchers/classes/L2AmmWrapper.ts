import rateLimitRetry from 'src/decorators/rateLimitRetry'
import { Contract } from 'ethers'
import { isL1ChainId } from 'src/utils'

export default class L2AmmWrapper {
  ammWrapperContract: Contract

  constructor (ammWrapperContract: Contract) {
    this.ammWrapperContract = ammWrapperContract
  }

  @rateLimitRetry
  async decodeSwapAndSendData (data: string): Promise<any> {
    let attemptSwap = false
    const decoded = await this.ammWrapperContract.interface.decodeFunctionData(
      'swapAndSend',
      data
    )
    const chainId = Number(decoded.chainId.toString())

    if (!isL1ChainId(chainId)) {
      // L2 to L2 transfers have destination swap parameters set
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
