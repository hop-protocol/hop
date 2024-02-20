import { BigNumber } from 'ethers'
import { solidityKeccak256 } from 'ethers/lib/utils.js'

const getTransferRootId = (rootHash: string, totalAmount: BigNumber) => {
  return solidityKeccak256(
    ['bytes32', 'uint256'],
    [rootHash, totalAmount]
  )
}

export default getTransferRootId
