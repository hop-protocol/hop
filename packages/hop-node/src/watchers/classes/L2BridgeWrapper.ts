import rateLimitRetry from 'src/utils/rateLimitRetry'
import { Contract } from 'ethers'

export default class L2BridgeWrapper {
  l2BridgeWrapperContract: Contract

  constructor (l2BridgeWrapperContract: Contract) {
    this.l2BridgeWrapperContract = l2BridgeWrapperContract
  }

  getMessengerAddress = rateLimitRetry(async (): Promise<string> => {
    return this.l2BridgeWrapperContract.messenger()
  })
}
