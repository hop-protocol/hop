import { Contract } from 'ethers'
import rateLimitRetry from 'src/decorators/rateLimitRetry'

export default class L2BridgeWrapper {
  l2BridgeWrapperContract: Contract

  constructor (l2BridgeWrapperContract: Contract) {
    this.l2BridgeWrapperContract = l2BridgeWrapperContract
  }

  @rateLimitRetry
  async getMessengerAddress (): Promise<string> {
    return this.l2BridgeWrapperContract.messenger()
  }
}
