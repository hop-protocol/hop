import ContractBase from './ContractBase'
import { BigNumber } from 'ethers'

export default class MessengerWrapper extends ContractBase {
  confirmRoots = async (rootHashes: string[], destinationChainIds: number[], totalAmounts: BigNumber[], rootCommittedAts: number[]): Promise<void> => {
    return this.contract.confirmRoots(
      rootHashes,
      destinationChainIds,
      totalAmounts,
      rootCommittedAts
    )
  }
}
