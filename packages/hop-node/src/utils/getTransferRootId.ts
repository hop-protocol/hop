import { solidityKeccak256 } from 'ethers/lib/utils.js'
import type { BigNumber } from 'ethers'

const getTransferRootId = (rootHash: string, totalAmount: BigNumber) => {
  return solidityKeccak256(
    ['bytes32', 'uint256'],
    [rootHash, totalAmount]
  )
}

export default getTransferRootId
