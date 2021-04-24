import { Contract } from 'ethers'
import { isL1NetworkId } from 'src/utils'

export default class L2AmmWrapper {
  ammWrapperContract: Contract

  constructor (ammWrapperContract: Contract) {
    this.ammWrapperContract = ammWrapperContract
  }

  async decodeSwapAndSendData (data: string) {
    let chainId = ''
    let attemptSwap = false
    const decoded = await this.ammWrapperContract.interface.decodeFunctionData(
      'swapAndSend',
      data
    )
    chainId = decoded.chainId.toString()

    if (!isL1NetworkId(chainId)) {
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
