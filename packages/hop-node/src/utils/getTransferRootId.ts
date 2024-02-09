
import { solidityKeccak256 } from 'ethers'

const getTransferRootId = (rootHash: string, totalAmount: bigint) => {
  return solidityKeccak256(
    ['bytes32', 'uint256'],
    [rootHash, totalAmount]
  )
}

export default getTransferRootId
