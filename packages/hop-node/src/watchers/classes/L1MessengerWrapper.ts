import ContractBase from './ContractBase'
import { BigNumber } from 'ethers'

export default class L1MessengerWrapper extends ContractBase {
  confirmRoots = async (rootHashes: string[], destinationChainIds: number[], totalAmounts: BigNumber[], rootCommittedAts: number[]): Promise<void> => {
    // This function requires additional validation that is handled up a level where additional data is
    // available. It is expected that this function is only called from the ConfirmRootsWatcher.confirmRootsViaWrapper
    // function that has these data checks in place.
    const isValid = this.isValidCaller()
    if (!isValid) {
      throw new Error('Invalid caller')
    }

    return this.contract.confirmRoots(
      rootHashes,
      destinationChainIds,
      totalAmounts,
      rootCommittedAts
    )
  }

  l2ChainId = async (): Promise<BigNumber> => {
    return this.contract.l2ChainId()
  }

  private isValidCaller (): boolean {
    // From https://stackoverflow.com/questions/30162577/how-to-get-caller-function-class-name
    try {
      throw new Error();
    }
    catch (err) {
      const expectedCaller = 'ConfirmRootsWatcher.confirmRootsViaWrapper'
      const caller = err.stack?.split('\n')[3].trim().substring(3, 45)
      if (caller !== expectedCaller) {
        return false
      }
    }
    return true
  } 
}
