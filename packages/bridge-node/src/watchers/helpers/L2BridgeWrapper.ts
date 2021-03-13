import { Contract } from 'ethers'

export default class L2BridgeWrapper {
  l2BridgeWrapperContract: Contract

  constructor (l2BridgeWrapperContract: Contract) {
    this.l2BridgeWrapperContract = l2BridgeWrapperContract
  }

  async getMessengerAddress () {
    return this.l2BridgeWrapperContract.messenger()
  }
}
