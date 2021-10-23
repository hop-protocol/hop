import rateLimitRetry from 'src/utils/rateLimitRetry'
import { L2BridgeWrapper as L2BridgeWrapperContract } from '@hop-protocol/core/contracts/L2BridgeWrapper'

export default class L2BridgeWrapper {
  constructor (private readonly l2BridgeWrapperContract: L2BridgeWrapperContract) {}

  getMessengerAddress = rateLimitRetry(async (): Promise<string> => {
    return await this.l2BridgeWrapperContract.messenger()
  })
}
